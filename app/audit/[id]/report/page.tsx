'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import {
    Shield, Download, Share2, ChevronLeft,
    CheckCircle, AlertTriangle, Fingerprint,
    Activity, Zap, ChevronDown, ChevronUp, Cpu, Maximize2
} from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function ReportView() {
    const { id } = useParams();
    const router = useRouter();

    const [report, setReport] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
    const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [], // Hide default sidebar for cleaner look
    });

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                // 1. Fetch Report Metadata
                const reportRes = await apiClient.get(`/${id}/report`);
                setReport(reportRes.data);

                // 2. Fetch PDF Blob
                const pdfRes = await apiClient.get(`/${id}/pdf`, {
                    responseType: 'blob'
                });
                const url = URL.createObjectURL(pdfRes.data);
                setPdfUrl(url);

                if (reportRes.data.requirements?.length > 0) {
                    setSelectedReqId(reportRes.data.requirements[0].requirement_id);
                }
            } catch (err) {
                console.error("Data load failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLIANT': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'PARTIAL': return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
            case 'NON_COMPLIANT': return 'text-red-600 bg-red-600/10 border-red-600/20';
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-brand-black flex flex-col items-center justify-center gap-6">
                <div className="animate-spin text-brand-primary">
                    <Activity size={40} />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-zinc-500 animate-pulse">
                    Decrypting Audit Layer...
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-brand-black text-zinc-100 flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 border-b border-brand-muted bg-brand-black/95 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 border border-brand-muted hover:border-brand-primary text-zinc-500 hover:text-brand-primary transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-xs font-mono font-bold uppercase tracking-tight text-zinc-100 leading-none mb-1">
                            {report?.filename || 'Unknown Document'}
                        </h1>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                            ID: {String(id).slice(0, 12)}...
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 text-[10px] font-mono font-bold border ${report?.overall_verdict === 'GREEN' ? 'border-emerald-500 text-emerald-500' :
                        report?.overall_verdict === 'YELLOW' ? 'border-brand-primary text-brand-primary' :
                            'border-red-600 text-red-600'
                        }`}>
                        STATUS: {report?.overall_verdict}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow flex overflow-hidden">
                {/* PDF Viewer (70%) */}
                <div className="w-[70%] bg-[#1a1d21] relative flex flex-col">
                    <div className="h-8 bg-brand-black/50 border-b border-brand-muted flex items-center justify-between px-4">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                            Legal_Vector_Renderer_v2.1
                        </span>
                        <Maximize2 size={12} className="text-zinc-600" />
                    </div>

                    <div className="flex-grow overflow-hidden relative">
                        {pdfUrl && (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={pdfUrl}
                                    plugins={[defaultLayoutPluginInstance]}
                                    theme="dark"
                                />
                            </Worker>
                        )}
                    </div>

                    {/* BBox Overlay Hint (Ideally implemented via custom renderPage) */}
                    <div className="absolute bottom-6 right-6 bg-brand-black/80 border border-brand-muted p-3 backdrop-blur pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono text-brand-primary uppercase">
                                AI Vision Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Analysis Panel (30%) */}
                <div className="w-[30%] flex flex-col bg-brand-black border-l border-brand-muted">
                    <div className="p-4 border-b border-brand-muted">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Activity size={12} /> Compliance Stack
                        </h2>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {report?.requirements?.map((req: any) => (
                            <div
                                key={req.requirement_id}
                                className={`card-industrial transition-all cursor-pointer ${selectedReqId === req.requirement_id
                                    ? 'border-brand-primary bg-brand-primary/5'
                                    : 'bg-brand-dark/20 opacity-80 hover:opacity-100'
                                    }`}
                                onClick={() => {
                                    setSelectedReqId(req.requirement_id);
                                    setExpandedReqId(expandedReqId === req.requirement_id ? null : req.requirement_id);
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase">
                                                {req.requirement_id}
                                            </span>
                                            <div className={`px-1.5 py-0.5 text-[8px] font-mono font-bold border ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </div>
                                        </div>
                                        <h3 className="text-xs font-bold text-zinc-200 leading-snug">
                                            {req.title || 'Requirement'}
                                        </h3>
                                    </div>
                                    <div className="text-zinc-600 mt-1">
                                        {expandedReqId === req.requirement_id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedReqId === req.requirement_id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 space-y-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-mono font-bold text-brand-primary uppercase opacity-70">
                                                        Agent_Reasoning:
                                                    </span>
                                                    <p className="text-[10px] text-zinc-400 font-mono leading-relaxed border-l-2 border-brand-muted pl-2">
                                                        {req.reason}
                                                    </p>
                                                </div>

                                                {req.evidence && req.evidence.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase opacity-70">
                                                            Found_Evidence:
                                                        </span>
                                                        <div className="bg-brand-dark/50 p-2 border border-brand-muted text-[9px] text-zinc-300 font-mono">
                                                            "{req.evidence[0]}"
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Visual indicator of bboxes availability */}
                                                {req.metadata?.bboxes?.length > 0 && (
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <Zap size={10} className="text-yellow-400" />
                                                        <span className="text-[9px] font-mono text-yellow-400 uppercase">
                                                            {req.metadata.bboxes.length} Vectors Mapped
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-brand-muted bg-brand-dark/50 flex justify-between items-center text-[9px] font-mono text-zinc-600">
                        <span>SYS_READY</span>
                        <Cpu size={12} />
                    </div>
                </div>
            </div>
        </div>
    );
}
