'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Download, Share2,
    CheckCircle, AlertTriangle, AlertCircle,
    FileText, Search, ChevronRight, ChevronDown,
    ExternalLink, Fingerprint, Gavel,
    ArrowUpRight, Info, BookOpen
} from 'lucide-react';
import Link from 'next/link';

const MOCK_REPORT = {
    id: 'p-8821',
    filename: 'privacy_v2_final.pdf',
    score: 88,
    verdict: 'GREEN',
    fingerprint: 'SHA256: 8f23...7721-ac4d',
    evaluatedAt: '2026-01-30 13:42:00',
    requirements: [
        {
            id: 'req-1',
            title: 'Personal Data Accuracy',
            section: 'Section 8',
            status: 'COMPLIANT',
            reasoning: 'The policy explicitly mentions mechanisms for users to update their data in Clause 4.2. This aligns with the Accuracy and Correction requirements of DPDP Act Sec 8(1).',
            evidence: 'Clause 4.2: Users may request correction of inaccurate or incomplete personal data through the portal...',
            remediation: null,
            bboxes: [{ page: 2, top: 120, left: 45, width: 340, height: 45 }]
        },
        {
            id: 'req-2',
            title: 'Data Retention Limits',
            section: 'Section 12',
            status: 'WARNING',
            reasoning: 'The policy specifies a 5-year retention period but fails to provide a clear technical justification for this specific duration post-fulfillment of purpose.',
            evidence: 'Clause 7.1: We retain data for 5 years after account closure for administrative tracking.',
            remediation: 'Implement a purpose-linked retention schedule and explicitly link the duration to legal obligations or business necessity as per Sec 12(3).',
            bboxes: [{ page: 4, top: 550, left: 45, width: 380, height: 60 }]
        },
        {
            id: 'req-3',
            title: 'Notice for Processing',
            section: 'Section 5',
            status: 'CRITICAL',
            reasoning: 'Missing notice of the right to withdraw consent and the right to grievance redressal within the primary notice clause.',
            evidence: 'Clause 2.0: By using the service you agree to data collection...',
            remediation: 'Update the Notice Clause to include a prominent summary of Data Principal rights, specifically the right to withdraw consent and the contact details of the Grievance Officer.',
            bboxes: [{ page: 1, top: 210, left: 45, width: 420, height: 80 }]
        }
    ]
};

export default function ReportView() {
    const [selectedReq, setSelectedReq] = useState<string | null>(MOCK_REPORT.requirements[0].id);
    const [activeTab, setActiveTab] = useState<'reasoning' | 'evidence' | 'remediation'>('reasoning');

    const selectedData = MOCK_REPORT.requirements.find(r => r.id === selectedReq);

    return (
        <div className="h-screen bg-brand-black text-[#f0f2f5] flex flex-col font-sans overflow-hidden">
            {/* Top Header */}
            <header className="h-20 border-b border-white/5 bg-brand-black/90 backdrop-blur-xl flex items-center shrink-0 px-8">
                <div className="flex items-center gap-4 border-r border-white/5 pr-8 mr-8">
                    <Shield className="text-brand-primary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-heading text-white tracking-tight italic">Forensic Audit View</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-sans">Record ID: {MOCK_REPORT.id}</p>
                    </div>
                </div>

                <div className="flex-grow flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${MOCK_REPORT.verdict === 'GREEN' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">{MOCK_REPORT.verdict} VERDICT</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                        <Fingerprint size={16} />
                        <span className="text-[10px] font-bold font-sans uppercase tracking-[0.2em]">{MOCK_REPORT.fingerprint}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary py-2.5 px-4 rounded-xl text-xs font-bold gap-2">
                        <Share2 size={16} /> Protocol Link
                    </button>
                    <button className="btn btn-primary py-2.5 px-5 rounded-xl text-xs font-bold gap-2 shadow-2xl">
                        <Download size={16} /> Defensibility Export
                    </button>
                </div>
            </header>

            <main className="flex-grow flex overflow-hidden">
                {/* Left Pane: PDF Simulation (60%) */}
                <div className="w-3/5 border-r border-white/5 bg-[#080b0f] relative overflow-hidden flex flex-col items-center p-12 custom-scrollbar overflow-y-auto">
                    <div className="w-full max-w-[850px] space-y-12">
                        {/* Simulated PDF Pages */}
                        {[1, 2, 3, 4, 5].map(page => (
                            <div key={page} className="bg-[#11161d] shadow-2xl rounded-sm aspect-[1/1.414] w-full p-16 relative border border-white/5">
                                <div className="absolute top-8 right-12 text-[9px] font-bold text-slate-700 uppercase tracking-widest">Page {page} // SECURED</div>
                                <div className="space-y-6 opacity-30">
                                    <div className="h-6 w-3/4 bg-slate-800 rounded-sm" />
                                    <div className="space-y-3">
                                        <div className="h-3 w-full bg-slate-800 rounded-sm" />
                                        <div className="h-3 w-full bg-slate-800 rounded-sm" />
                                        <div className="h-3 w-5/6 bg-slate-800 rounded-sm" />
                                    </div>
                                    <div className="h-4 w-1/4 bg-slate-800 rounded-sm pt-8" />
                                    <div className="space-y-3">
                                        <div className="h-3 w-full bg-slate-800 rounded-sm" />
                                        <div className="h-3 w-11/12 bg-slate-800 rounded-sm" />
                                    </div>
                                </div>

                                {/* Draw Highlight if matching page */}
                                {selectedData?.bboxes.find(b => b.page === page) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute border-2 border-brand-primary bg-brand-primary/10 rounded-sm shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                                        style={{
                                            top: `${selectedData.bboxes[0].top}px`,
                                            left: `${selectedData.bboxes[0].left}px`,
                                            width: `${selectedData.bboxes[0].width}px`,
                                            height: `${selectedData.bboxes[0].height}px`,
                                        }}
                                    >
                                        <div className="absolute -top-10 left-0 bg-brand-primary text-brand-black text-[9px] font-bold px-2 py-0.5 rounded-t-sm uppercase">Verification Lock</div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Compliance Stack (40%) */}
                <div className="w-2/5 flex flex-col bg-brand-black overflow-hidden font-sans">
                    <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                        <h2 className="text-2xl font-heading text-white mb-2 italic">Requirement Stack</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-sans">DPDP Act 2023 // Section Mapping</p>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 space-y-4 custom-scrollbar">
                        {MOCK_REPORT.requirements.map((req) => (
                            <button
                                key={req.id}
                                onClick={() => setSelectedReq(req.id)}
                                className={`w-full text-left p-6 rounded-2xl transition-all border flex gap-6 items-start ${selectedReq === req.id ? 'glass border-brand-primary/30 ring-1 ring-brand-primary/20 bg-brand-primary/[0.02]' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}`}
                            >
                                <div className={`mt-1 p-2.5 rounded-xl border shrink-0 ${req.status === 'COMPLIANT' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : req.status === 'WARNING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                    {req.status === 'COMPLIANT' ? <CheckCircle size={20} /> : req.status === 'WARNING' ? <AlertTriangle size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">{req.section}</span>
                                        <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full font-sans ${req.status === 'COMPLIANT' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}>{req.status}</span>
                                    </div>
                                    <h3 className="text-xl font-heading text-white tracking-tight italic mb-3">{req.title}</h3>

                                    <AnimatePresence>
                                        {selectedReq === req.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden space-y-6 pt-2"
                                            >
                                                <div className="flex gap-2 border-b border-white/5 pb-2">
                                                    {['reasoning', 'evidence', 'remediation'].map(tab => (
                                                        <button
                                                            key={tab}
                                                            onClick={(e) => { e.stopPropagation(); setActiveTab(tab as any); }}
                                                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg font-sans transition-all ${activeTab === tab ? 'bg-brand-primary text-brand-black' : 'text-slate-600 hover:text-white'}`}
                                                        >
                                                            {tab}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="text-sm leading-relaxed text-slate-400 font-medium">
                                                    {activeTab === 'reasoning' && req.reasoning}
                                                    {activeTab === 'evidence' && <div className="bg-[#0d1117] p-4 rounded-xl border border-white/5 text-[13px] text-slate-300 italic">“{req.evidence}”</div>}
                                                    {activeTab === 'remediation' && (
                                                        req.remediation ? (
                                                            <div className="space-y-3">
                                                                <p>{req.remediation}</p>
                                                                <button className="flex items-center gap-2 text-brand-primary text-xs font-bold hover:underline">
                                                                    <BookOpen size={14} /> View Regulatory Precedent <ArrowUpRight size={12} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <p className="text-emerald-500/50">No remediation required for this clause.</p>
                                                        )
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-4 text-slate-600">
                            <Gavel size={18} />
                            <p className="text-[11px] font-bold font-sans uppercase tracking-[0.2em] leading-relaxed">
                                Official evaluation conducted by Subsystem-014. Findings are legally anchorable.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
