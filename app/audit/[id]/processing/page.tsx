'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Loader2, CheckCircle,
    Database, Zap, Lock, Cpu, Gavel,
    Terminal, Activity, LayoutGrid
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/api-client';

export default function ProcessingRoom() {
    const { id } = useParams();
    const router = useRouter();

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('PENDING');
    const [logs, setLogs] = useState<any[]>([]);

    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;

        const pollStatus = async () => {
            try {
                const res = await apiClient.get(`/${id}/status`);

                const { status: newStatus, progress: newProgress, logs: newLogs } = res.data;

                setStatus(newStatus);
                setProgress(Math.floor(newProgress * 100));

                if (newLogs) {
                    setLogs(newLogs);
                }

                if (newStatus === 'COMPLETED') {
                    setTimeout(() => router.push(`/audit/${id}/report`), 1000);
                } else if (newStatus === 'FAILED') {
                    // Handle failure
                }

            } catch (err) {
                console.error("Polling error:", err);
            }
        };

        const interval = setInterval(pollStatus, 2000);
        return () => clearInterval(interval);
    }, [id, router]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const steps = [
        { name: 'Ingestion', icon: <Database size={18} /> },
        { name: 'Extraction', icon: <Zap size={18} /> },
        { name: 'Reasoning', icon: <Cpu size={18} /> },
        { name: 'Verification', icon: <Gavel size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-brand-black text-[#f0f2f5] flex flex-col font-sans">
            {/* Header */}
            <header className="border-b border-white/5 bg-brand-black/90 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="text-brand-primary w-8 h-8" />
                        <h1 className="text-2xl font-heading tracking-tight text-white italic">Live Audit Trace</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Session_AU_Active</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Progress Visuals */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-heading text-white italic">Synchronizing <br /><span className="text-brand-primary">Regulatory Logic</span></h2>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                            Executing multi-agent verification protocol. Preservation of context window is active.
                        </p>
                    </div>

                    <div className="relative h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-brand-primary shadow-[0_0_20px_rgba(197,160,89,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }} // Smooth out the jumps
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {steps.map((s, i) => {
                            const isActive = progress > (i * 25);
                            return (
                                <div key={i} className={`glass p-6 rounded-2xl border transition-all duration-700 ${isActive ? 'border-brand-primary/40' : 'border-white/5 opacity-30'}`}>
                                    <div className={`mb-4 transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-600'}`}>{s.icon}</div>
                                    <p className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}>{s.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Agent Terminal */}
                <div className="glass rounded-3xl border-white/5 overflow-hidden flex flex-col h-[520px] shadow-2xl relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

                    <div className="p-6 border-b border-white/5 bg-brand-black/40 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                            <Terminal size={18} className="text-brand-primary" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Autonomous Trace Log</span>
                        </div>
                        <div className="flex gap-1.5 font-bold">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                        </div>
                    </div>

                    <div className="flex-grow p-8 overflow-y-auto space-y-6 relative z-10 custom-scrollbar">
                        <AnimatePresence>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-4"
                                >
                                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter w-16 pt-1">[{log.agent}]</span>
                                    <div className="flex-grow space-y-1">
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{log.message}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={logEndRef} />

                        {status !== 'COMPLETED' && (
                            <div className="flex gap-4 italic animate-pulse">
                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter w-16 pt-1">[Sys]</span>
                                <p className="text-sm text-slate-700 font-medium tracking-wide">Synthesizing inference nodes...</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-brand-black/40 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest relative z-10">
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-emerald-500" />
                            Status: {status}
                        </div>
                        <div>Progress: {progress}%</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
