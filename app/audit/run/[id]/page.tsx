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
    AlertTriangle, ChevronLeft, Loader2, Maximize2
} from 'lucide-react';
import apiClient from '@/lib/api-client';

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

    // UI Logic
    const [activeTab, setActiveTab] = useState<'console' | 'findings'>('console');
    const logEndRef = useRef<HTMLDivElement>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin({ sidebarTabs: () => [] });

    // 1. Initial Data Load (PDF + Status)
    useEffect(() => {
        if (!id) return;

        const initRoom = async () => {
            try {
                // Fetch PDF Blob
                const pdfRes = await apiClient.get(`/${id}/pdf`, { responseType: 'blob' });
                setPdfUrl(URL.createObjectURL(pdfRes.data));
            } catch (err) {
                console.error("Failed to load PDF asset", err);
            }
        };
        initRoom();
    }, [id]);

    // 2. Poll Status or Fetch Report
    useEffect(() => {
        if (!id) return;

        let interval: NodeJS.Timeout;

        const syncState = async () => {
            try {
                // Check status
                if (status !== 'COMPLETED') {
                    const res = await apiClient.get(`/${id}/status`);
                    const { status: newStatus, progress: newProgress, logs: newLogs } = res.data;

                    // Normalize status for UI
                    const normStatus = (newStatus || 'PENDING').toUpperCase();
                    setStatus(newStatus); // Keep raw for debugging
                    setProgress(Math.floor(newProgress * 100));
                    if (newLogs) setLogs(newLogs);

                    // Robust completion check: Status flag OR Log signal
                    const isLogFinished = newLogs?.some((l: any) => l.message?.includes('Audit Finalized'));
                    const isSuccess = normStatus === 'COMPLETED' || normStatus === 'SUCCESS' || normStatus === 'DONE' || isLogFinished;

                    if (isSuccess) {
                        setStatus('COMPLETED'); // Force UI to completed state

                        // Small delay to ensure DB consistency
                        await new Promise(r => setTimeout(r, 1000));

                        try {
                            const reportRes = await apiClient.get(`/${id}/report`);
                            if (reportRes.data) {
                                setReport(reportRes.data);
                                setActiveTab('findings');
                            }
                        } catch (err) {
                            console.error("Report generation lag:", err);
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

    // Auto-scroll logs
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
                                    plugins={[defaultLayoutPluginInstance]}
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

                    {/* Content Area */}
                    <div className="flex-grow overflow-y-auto p-0 relative bg-brand-black/50">
                        {/* 1. Console View */}
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

                        {/* 2. Findings View */}
                        {activeTab === 'findings' && report && (
                            <div className="p-4 space-y-4">
                                <div className={`p-4 rounded-lg border ${report.overall_verdict === 'GREEN' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <h3 className="text-sm font-bold text-white mb-1">Audit Score: {report.score || 0}/100</h3>
                                    <p className="text-xs text-slate-400">Verdict: {report.overall_verdict}</p>
                                </div>

                                <div className="space-y-3">
                                    {report.requirements?.map((req: any, i: number) => (
                                        <div key={i} className="p-4 rounded-sm bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-colors group cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-sm font-semibold text-slate-200">{req.title || `Requirement ${req.requirement_id}`}</h4>
                                                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${req.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>{req.status}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-white/10 pl-3 mb-3 hover:border-brand-primary/50 transition-colors">{req.reason}</p>

                                            {req.evidence && (
                                                <div className="bg-black/40 p-2 rounded-sm text-[10px] text-slate-500 font-mono truncate border border-white/5">
                                                    "{req.evidence[0]}"
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
