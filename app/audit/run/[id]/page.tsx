'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {
    Shield, Activity, Terminal, CheckCircle,
    AlertTriangle, ChevronLeft, Loader2, Maximize2,
    Search, AlertCircle, FileSearch, ArrowRight
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'COMPLETED': return <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={12} /> Complete</span>;
        case 'FAILED': return <span className="text-rose-500 flex items-center gap-1"><AlertTriangle size={12} /> Failed</span>;
        default: return <span className="text-brand-primary flex items-center gap-1 animate-pulse"><Loader2 size={12} className="animate-spin" /> Processing</span>;
    }
};

export default function AuditRoom() {
    const { id } = useParams();
    const router = useRouter();

    const [status, setStatus] = useState('PENDING');
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<any[]>([]);
    const [report, setReport] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'console' | 'findings'>('console');
    const logEndRef = useRef<HTMLDivElement>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin({ sidebarTabs: () => [] });
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const highlightPluginInstance = highlightPlugin({
        trigger: Trigger.None,
    });

    useEffect(() => {
        if (!id) return;

        const initRoom = async () => {
            try {

                const pdfRes = await apiClient.get(`/${id}/pdf`, { responseType: 'blob' });
                setPdfUrl(URL.createObjectURL(pdfRes.data));
            } catch (err) {
                console.error("Failed to load PDF asset", err);
            }
        };
        initRoom();
    }, [id]);


    useEffect(() => {
        if (!id) return;

        let interval: NodeJS.Timeout;

        const syncState = async () => {
            try {

                if (status !== 'COMPLETED') {
                    let res;
                    try {
                        res = await apiClient.get(`/${id}/status`);
                    } catch (e) {
                        console.warn("Retrying status sync at /audit/" + id + "/status");
                        res = await apiClient.get(`/audit/${id}/status`);
                    }

                    const { status: newStatus, progress: newProgress, logs: newLogs } = res.data;


                    const normStatus = (newStatus || 'PENDING').toUpperCase();
                    setStatus(newStatus);
                    setProgress(Math.floor((newProgress || 0) * 100));
                    if (newLogs) setLogs(newLogs);


                    const isLogFinished = newLogs?.some((l: any) => l.message?.includes('Audit Finalized'));
                    const isSuccess = normStatus === 'COMPLETED' || normStatus === 'SUCCESS' || normStatus === 'DONE' || isLogFinished;

                    if (isSuccess) {
                        setStatus('COMPLETED');
                        console.log("Audit completion signal detected. Fetching final report...");


                        await new Promise(r => setTimeout(r, 1200));

                        try {
                            let reportRes;
                            try {
                                reportRes = await apiClient.get(`/${id}/report`);
                            } catch (e) {
                                console.warn("Retrying report fetch at /audit/" + id + "/report");
                                reportRes = await apiClient.get(`/audit/${id}/report`);
                            }
                            console.log("Report API Response:", reportRes.data);


                            const reportData = reportRes.data.report || reportRes.data;

                            if (reportData && (reportData.requirements || reportData.findings)) {

                                if (!reportData.requirements && reportData.findings) {
                                    reportData.requirements = reportData.findings;
                                }
                                setReport(reportData);
                                setActiveTab('findings');
                                console.log("Report successfully loaded into state.");
                            } else {
                                console.warn("Report data received but missing requirements/findings array.");
                            }
                        } catch (err) {
                            console.error("Report fetch failed after completion:", err);
                        }
                    }
                }
            } catch (err) {
                console.error("Sync error", err);
            }
        };

        if (status !== 'COMPLETED') {
            interval = setInterval(syncState, 2000);
        }

        return () => clearInterval(interval);
    }, [id, status]);


    useEffect(() => {
        if (activeTab === 'console') {
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, activeTab]);

    return (
        <div className="h-screen flex flex-col bg-brand-black text-slate-200 font-sans overflow-hidden selection:bg-brand-primary/20">
            {/* Header */}
            <header className="h-14 border-b border-white/5 bg-brand-black flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-brand-primary" />
                        <span className="text-sm font-semibold tracking-tight text-white">Audit Room</span>
                        <span className="text-xs text-slate-500 font-mono">ID: {String(id).slice(0, 8)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono font-medium">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 uppercase tracking-wider">Status</span>
                        <StatusBadge status={status} />
                    </div>
                </div>
            </header>

            {/* Split View */}
            <div className="flex-grow flex overflow-hidden">
                {/* PDF Viewer (Left) */}
                <div className="flex-grow bg-[#1a1c1e] relative flex flex-col border-r border-white/5">
                    {pdfUrl ? (
                        <div className="flex-grow overflow-hidden relative">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={pdfUrl}
                                    plugins={[
                                        defaultLayoutPluginInstance,
                                        pageNavigationPluginInstance,
                                        highlightPluginInstance
                                    ]}
                                    theme="dark"
                                />
                            </Worker>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-600 gap-2">
                            <Loader2 className="animate-spin" /> Loading asset...
                        </div>
                    )}
                </div>

                {/* Intelligence Panel (Right) */}
                <div className="w-[400px] flex-shrink-0 bg-brand-black flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => setActiveTab('console')}
                            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'console' ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-primary/5' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                            Live Trace
                        </button>
                        <button
                            onClick={() => status === 'COMPLETED' && setActiveTab('findings')}
                            disabled={status !== 'COMPLETED'}
                            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'findings' ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-primary/5' : 'text-slate-600 disabled:opacity-50 hover:text-slate-400'}`}
                        >
                            Findings
                        </button>
                    </div>


                    <div className="flex-grow overflow-y-auto p-0 relative bg-brand-black/50">
                        {activeTab === 'console' && (
                            <div className="p-6 space-y-2 font-mono text-xs">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 text-slate-400"
                                    >
                                        <span className="text-brand-primary/70">[{log.agent || 'SYS'}]</span>
                                        <span className="text-slate-300">{log.message}</span>
                                    </motion.div>
                                ))}
                                {status !== 'COMPLETED' && (
                                    <div className="flex gap-2 text-brand-primary animate-pulse pt-2">
                                        <span>&gt;</span>
                                        <span className="w-2 h-4 bg-brand-primary block" />
                                    </div>
                                )}
                                <div ref={logEndRef} />
                            </div>
                        )}


                        {activeTab === 'findings' && report && (
                            <div className="flex flex-col h-full bg-brand-black/40">
                                <div className="p-6 border-b border-white/5 bg-brand-black/60 sticky top-0 z-10 backdrop-blur-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Shield size={16} className="text-brand-primary" />
                                            COMPLIANCE POSTURE
                                        </h3>
                                        <div className={`px-2 py-1 rounded-sm text-[10px] font-bold border ${report.overall_verdict === 'GREEN' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                            {report.overall_verdict}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Audit Score</p>
                                            <p className="text-xl font-heading text-white">{report.score || 0}%</p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Critical Risks</p>
                                            <p className="text-xl font-heading text-rose-500">
                                                {report.requirements?.filter((r: any) => r.status === 'NON_COMPLIANT' || r.status === 'PARTIAL').length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                <div className="p-6 space-y-6 overflow-y-auto flex-grow pb-20">
                                    <div className="space-y-4">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-4">Clause-Level Analysis</p>

                                        {report.requirements?.map((req: any, i: number) => {
                                            const isUrgent = req.status === 'NON_COMPLIANT' || req.status === 'PARTIAL';
                                            return (
                                                <div key={i} className={`p-4 rounded-sm border transition-all group ${isUrgent ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40' : 'bg-white/5 border-white/10 hover:border-brand-primary/30'}`}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-start gap-2 max-w-[70%]">
                                                            {isUrgent ? <AlertCircle size={14} className="text-rose-500 flex-shrink-0 mt-0.5" /> : <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />}
                                                            <h4 className="text-xs font-bold text-slate-200 leading-tight">
                                                                {req.title || `Requirement ${i + 1}`}
                                                            </h4>
                                                        </div>
                                                        <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${req.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                            {req.status}
                                                        </span>
                                                    </div>

                                                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4 pl-4 border-l-2 border-white/10 italic">
                                                        {req.reason}
                                                    </p>

                                                    {req.evidence && req.evidence.length > 0 && (
                                                        <div className="space-y-2">
                                                            <div className="bg-black/40 p-3 rounded-sm text-[10px] text-slate-400 font-mono border border-white/5 relative group-hover:bg-black/60 transition-colors">
                                                                <Terminal size={12} className="absolute top-2 right-2 opacity-20" />
                                                                <span className="text-brand-primary/60 block mb-1 uppercase font-bold text-[8px]">Extracted Trace:</span>
                                                                {req.evidence[0]}
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    const pageIdx = req.page_index !== undefined ? req.page_index : (req.page_number ? req.page_number - 1 : 0);
                                                                    pageNavigationPluginInstance.jumpToPage(pageIdx);
                                                                }}
                                                                className="w-full flex items-center justify-center gap-2 py-2 rounded-sm bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                                            >
                                                                <FileSearch size={14} /> Jump to Source Page {req.page_number || req.page_index + 1 || ''}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
