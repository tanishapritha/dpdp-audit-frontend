'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Upload, CheckCircle, ArrowRight, ArrowLeft,
    FileText, Search, ShieldCheck, Gavel, Cpu, AlertCircle, History, FileCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

export default function AuditWizard() {
    const [step, setStep] = useState(1);
    const [frameworks, setFrameworks] = useState<any[]>([]);
    const [selectedFramework, setSelectedFramework] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchFrameworks = async () => {
            try {
                const res = await apiClient.get('/frameworks/');
                setFrameworks(res.data);
                if (res.data.length > 0) {
                    setSelectedFramework(res.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch frameworks", err);
            }
        };
        fetchFrameworks();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const startProcessing = async () => {
        if (!file || !selectedFramework) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('framework_id', selectedFramework);

        try {
            const res = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { policy_id } = res.data;
            router.push(`/audit/run/${policy_id}`);
        } catch (err) {
            console.error("Upload failed", err);
            setUploading(false);
        }
    };

    return (
        <div className="h-screen bg-brand-black text-[#f0f2f5] flex flex-col overflow-hidden">
            <header className="border-b border-white/5 bg-brand-black/90 backdrop-blur-xl shrink-0">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="text-brand-primary w-6 h-6" />
                        <h1 className="text-xl font-heading tracking-tight text-white italic">Audit Provisioning</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-brand-primary' : 'w-4 bg-brand-muted'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Step {step}/2</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow overflow-hidden flex flex-col pt-10 px-6">
                <div className="container mx-auto max-w-5xl flex-grow flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col h-full"
                            >
                                <div className="mb-8">
                                    <h2 className="text-4xl font-heading text-white mb-3">Select <span className="italic text-brand-primary">Baseline</span></h2>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                                        System agents will calibrate specifically for this regulatory jurisdiction.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto pb-10 scrollbar-hide">
                                    {frameworks.map((fw) => (
                                        <button
                                            key={fw.id}
                                            onClick={() => setSelectedFramework(fw.id)}
                                            className={`relative text-left p-8 rounded-sm glass transition-all border ${selectedFramework === fw.id ? 'border-brand-primary bg-brand-primary/5 shadow-xl shadow-brand-primary/5' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/10'}`}
                                        >
                                            {selectedFramework === fw.id && (
                                                <div className="absolute top-6 right-6 text-brand-primary">
                                                    <CheckCircle size={22} />
                                                </div>
                                            )}
                                            <h3 className="text-2xl font-heading text-white mb-3 tracking-tight">{fw.name}</h3>
                                            <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed line-clamp-2">{fw.description}</p>
                                            <div className="flex gap-6 border-t border-white/5 pt-6 font-sans font-bold text-[9px] uppercase tracking-widest text-slate-500">
                                                <div>
                                                    <p>Clauses</p>
                                                    <p className="text-white text-base mt-1 font-heading">{fw.sections_count || fw.sections}</p>
                                                </div>
                                                <div>
                                                    <p>Complexity</p>
                                                    <p className="text-brand-primary text-base mt-1 font-heading">{fw.complexity}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col h-full"
                            >
                                <div className="mb-8">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 font-sans font-bold text-[10px] uppercase tracking-widest"
                                    >
                                        <ArrowLeft size={14} /> Back to Baseline
                                    </button>
                                    <h2 className="text-4xl font-heading text-white mb-3 tracking-tight">Secure <span className="text-brand-primary">Ingestion</span></h2>
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                        Upload fiduciary asset for semantic auditing against <b>{frameworks.find(f => f.id === selectedFramework)?.name}</b>.
                                    </p>
                                </div>

                                <div className="flex-grow flex flex-col justify-center pb-20 overflow-hidden">
                                    <div className="glass rounded-sm border-dashed border-2 border-brand-primary/20 p-16 text-center relative group hover:border-brand-primary/40 transition-all cursor-pointer overflow-hidden max-w-3xl mx-auto w-full">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleFileSelect}
                                            disabled={uploading}
                                        />
                                        <div className="space-y-6 relative z-0">
                                            <div className="w-16 h-16 bg-brand-primary/5 rounded-sm border border-brand-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                {file ? <FileCheck className="text-brand-primary w-8 h-8" /> : <Upload className="text-brand-primary w-8 h-8" />}
                                            </div>
                                            {file ? (
                                                <div className="space-y-3">
                                                    <p className="text-xl font-heading text-white italic">{file.name}</p>
                                                    <p className="text-slate-500 font-sans font-bold text-[9px] uppercase tracking-widest">SIZE: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    <button
                                                        onClick={() => setFile(null)}
                                                        className="text-rose-500 text-[10px] font-bold font-sans uppercase tracking-[0.2em] hover:text-rose-400 transition-colors pointer-events-auto"
                                                    >
                                                        Remove Asset
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <p className="text-xl font-heading text-white tracking-tight">Drop fiduciary asset here</p>
                                                    <p className="text-slate-500 text-xs font-medium">Standard PDF geometric mapping will be applied.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>


            <footer className="shrink-0 border-t border-white/5 bg-brand-black/80 backdrop-blur-xl p-8">
                <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="grid grid-cols-3 gap-8">
                        {[
                            { icon: <ShieldCheck size={14} />, label: "Integrity" },
                            { icon: <Gavel size={14} />, label: "Statutory" },
                            { icon: <Cpu size={14} />, label: "Spectral" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                                <span className="text-brand-primary opacity-50">{item.icon}</span> {item.label}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {step === 1 ? (
                            <button
                                onClick={() => setStep(2)}
                                className="btn btn-primary h-12 px-8 text-xs font-bold gap-3 rounded-sm shadow-xl group"
                            >
                                Confirm Baseline <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={startProcessing}
                                disabled={!file || uploading}
                                className="btn btn-primary h-12 px-8 text-xs font-bold gap-3 rounded-sm shadow-xl disabled:opacity-30 transition-all group"
                            >
                                {uploading ? 'Initializing Agents...' : 'Start Audit Processing'}
                                {!uploading && <Cpu size={16} className="group-hover:rotate-12 transition-transform" />}
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );

}
