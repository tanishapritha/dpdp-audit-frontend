'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Upload, CheckCircle, ArrowRight, ArrowLeft,
    FileText, Search, ShieldCheck, Gavel, Cpu, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const FRAMEWORKS = [
    {
        id: 'dpdp-2023',
        name: 'DPDP Act 2023',
        description: 'Digital Personal Data Protection Act - The primary foundation for data privacy in modern India.',
        sections: 44,
        complexity: 'High'
    },
    {
        id: 'gdpr-compl',
        name: 'GDPR Alignment',
        description: 'Supplemental audit for General Data Protection Regulation compatibility in global jurisdictions.',
        sections: 99,
        complexity: 'Very High'
    }
];

export default function AuditWizard() {
    const [step, setStep] = useState(1);
    const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0].id);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const startProcessing = () => {
        setUploading(true);
        // Simulate upload and initialization
        setTimeout(() => {
            router.push('/audit/p-123/processing');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-brand-black text-[#f0f2f5] flex flex-col">
            <header className="border-b border-white/5 bg-brand-black/90 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="text-brand-primary w-8 h-8" />
                        <h1 className="text-2xl font-heading tracking-tight text-white italic">Audit Provisioning</h1>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-10 bg-brand-primary' : 'w-4 bg-brand-muted'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans">Step {step} of 2</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-20 max-w-5xl">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="max-w-2xl">
                                <h2 className="text-5xl font-heading text-white mb-6">Select <span className="italic text-brand-primary">Regulatory Baseline</span></h2>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Every audit initiation requires a defined framework baseline. The system will calibrate its RAG agents specifically for this jurisdiction.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {FRAMEWORKS.map((fw) => (
                                    <button
                                        key={fw.id}
                                        onClick={() => setSelectedFramework(fw.id)}
                                        className={`relative text-left p-10 rounded-2xl glass transition-all border ${selectedFramework === fw.id ? 'border-brand-primary shadow-2xl shadow-brand-primary/10' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'}`}
                                    >
                                        {selectedFramework === fw.id && (
                                            <div className="absolute top-6 right-6 text-brand-primary">
                                                <CheckCircle size={28} />
                                            </div>
                                        )}
                                        <h3 className="text-3xl font-heading text-white mb-4 italic">{fw.name}</h3>
                                        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">{fw.description}</p>
                                        <div className="flex gap-8 border-t border-white/5 pt-8 font-sans font-bold text-[10px] uppercase tracking-widest text-slate-500">
                                            <div>
                                                <p>Clauses</p>
                                                <p className="text-white text-lg mt-1 font-heading">{fw.sections}</p>
                                            </div>
                                            <div>
                                                <p>Complexity</p>
                                                <p className="text-brand-primary text-lg mt-1 font-heading">{fw.complexity}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end pt-8">
                                <button
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary h-16 px-12 text-base font-bold gap-3 rounded-xl shadow-2xl group"
                                >
                                    Confirm and Proceed <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="max-w-2xl">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 font-sans font-bold text-xs uppercase tracking-widest"
                                >
                                    <ArrowLeft size={16} /> Re-calibrate Baseline
                                </button>
                                <h2 className="text-5xl font-heading text-white mb-6 italic">Secure <span className="text-brand-primary">Asset Ingestion</span></h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Upload the fiduciary document for semantic auditing. The asset will be pre-processed and fragmented for agentic verification against <b>{FRAMEWORKS.find(f => f.id === selectedFramework)?.name}</b>.
                                </p>
                            </div>

                            <div className="glass rounded-3xl border-dashed border-2 border-brand-primary/20 p-20 text-center relative group hover:border-brand-primary/40 transition-all cursor-pointer overflow-hidden shadow-inner">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <div className="space-y-8 relative z-0">
                                    <div className="w-24 h-24 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        {file ? <FileText className="text-brand-primary w-12 h-12" /> : <Upload className="text-brand-primary w-12 h-12" />}
                                    </div>
                                    {file ? (
                                        <div className="space-y-3">
                                            <p className="text-2xl font-heading text-white italic">{file.name}</p>
                                            <p className="text-slate-500 font-sans font-bold text-[10px] uppercase tracking-widest">Size: {(file.size / 1024 / 1024).toFixed(2)} MB // TYPE: PDF_FIDUCIARY</p>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="text-rose-500 text-xs font-bold font-sans uppercase tracking-[0.2em] hover:text-rose-400 transition-colors"
                                            >
                                                Remove Asset
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-2xl font-heading text-white italic">Drop fiduciary asset here</p>
                                            <p className="text-slate-500 text-sm font-medium">Standard PDF format required for geometric mapping.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                                        <ShieldCheck size={14} className="text-emerald-500" /> End-to-end audit integrity verified
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                                        <History size={14} className="text-blue-500" /> Version control protocol initialized
                                    </div>
                                </div>
                                <button
                                    onClick={startProcessing}
                                    disabled={!file || uploading}
                                    className="btn btn-primary h-16 px-12 text-base font-bold gap-3 rounded-xl shadow-2xl disabled:opacity-30 disabled:shadow-none transition-all group"
                                >
                                    {uploading ? 'Initializing Agents...' : 'Start Audit Processing'}
                                    {!uploading && <Cpu size={20} className="group-hover:rotate-12 transition-transform" />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Security Note */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
                    {[
                        { icon: <Shield size={18} />, title: "Forensic Integrity", desc: "Every extraction cycle is signed and anchored in the audit log." },
                        { icon: <Gavel size={18} />, title: "Regulatory Compliance", desc: "Updated in real-time with official DPDP Act 2023 legal interpretations." },
                        { icon: <AlertCircle size={18} />, title: "Risk Safeguards", desc: "Automated flagging of adversarial logic and missing fiduciary clauses." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="text-brand-primary">{item.icon}</div>
                            <h4 className="text-xl font-heading text-white italic">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
