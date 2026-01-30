'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Plus, Search, Filter, Shield,
    Calendar, FileText,
    CheckCircle, AlertTriangle,
    ArrowUpRight, Gavel, FileCheck, History
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MOCK_AUDITS = [
    {
        id: 'p-8821',
        filename: 'privacy_v2_final.pdf',
        date: '2026-01-20',
        framework: 'DPDP Act 2023',
        score: 88,
        verdict: 'GREEN',
        status: 'COMPLETED'
    },
    {
        id: 'p-7712',
        filename: 'standard_terms_2025.pdf',
        date: '2026-01-15',
        framework: 'DPDP Act 2023',
        score: 42,
        verdict: 'RED',
        status: 'COMPLETED'
    },
    {
        id: 'p-6605',
        filename: 'mobile_app_policy.pdf',
        date: '2026-01-12',
        framework: 'DPDP Act 2023',
        score: 65,
        verdict: 'YELLOW',
        status: 'COMPLETED'
    }
];

export default function Dashboard() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const getVerdictStyle = (verdict: string) => {
        switch (verdict) {
            case 'GREEN': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'YELLOW': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'RED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-brand-black text-[#f0f2f5]">
            <header className="border-b border-white/5 bg-brand-black/90 backdrop-blur-xl sticky top-0 z-40">
                <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="text-brand-primary w-8 h-8" />
                        <h1 className="text-2xl font-heading tracking-tight text-white">Registry Center</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'Official Auditor'}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-bold">Node ID: AU-9921</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-brand-primary/20 flex items-center justify-center font-heading text-xl text-brand-primary bg-brand-primary/5">
                            {user?.name?.[0] || 'A'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                {/* Top Stats */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Audits', value: '142', icon: <FileText size={18} /> },
                        { label: 'Compliant Assets', value: '98', icon: <FileCheck size={18} />, color: 'text-emerald-500' },
                        { label: 'Avg Integrity Score', value: '74%', icon: <Gavel size={18} /> },
                        { label: 'System Uptime', value: '99.9%', icon: <History size={18} />, color: 'text-brand-primary' }
                    ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-2xl border-white/5">
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">{stat.label}</p>
                                <div className="text-slate-600">{stat.icon}</div>
                            </div>
                            <p className={`text-4xl font-heading ${stat.color || 'text-white'}`}>{stat.value}</p>
                        </div>
                    ))}
                </section>

                {/* Audit Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-heading text-white italic">Compliance Snapshots</h2>
                        <p className="text-slate-500 text-sm mt-1">Reviewing forensic audit records for organization node AU-192.</p>
                    </div>
                    <Link href="/audit" className="btn btn-primary px-8 py-4 text-base font-bold gap-3 rounded-xl shadow-2xl">
                        <Plus size={20} /> Initialize New Audit
                    </Link>
                </div>

                {/* Audit Table */}
                <div className="glass rounded-2xl overflow-hidden border-white/5">
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row gap-6 justify-between items-center bg-white/[0.01]">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                            <input
                                type="text"
                                placeholder="Search audit records..."
                                className="w-full bg-brand-black border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-primary/50 transition-all font-medium font-sans"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-secondary py-2.5 px-4 rounded-xl text-xs font-bold gap-2">
                                <Filter size={16} /> Filter
                            </button>
                            <button className="btn btn-secondary py-2.5 px-4 rounded-xl text-xs font-bold gap-2">
                                <Calendar size={16} /> Session Range
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                                    <th className="px-8 py-5">Fiduciary Asset</th>
                                    <th className="px-8 py-5">Verification Date</th>
                                    <th className="px-8 py-5">Regulatory Framework</th>
                                    <th className="px-8 py-5">Score</th>
                                    <th className="px-8 py-5">Verdict</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {MOCK_AUDITS.map((audit) => (
                                    <tr key={audit.id} className="hover:bg-white/[0.01] transition-colors group italic">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-brand-muted/40 rounded-xl border border-white/5">
                                                    <FileText size={20} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-heading text-white tracking-wide">{audit.filename}</p>
                                                    <p className="text-[10px] text-slate-600 font-sans font-bold uppercase tracking-tighter mt-0.5">{audit.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-sm text-slate-400 font-medium font-sans">{audit.date}</td>
                                        <td className="px-8 py-8 font-heading text-slate-200">{audit.framework}</td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-1.5 bg-brand-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${audit.score > 80 ? 'bg-emerald-500' : audit.score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${audit.score}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-white font-heading">{audit.score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border font-sans ${getVerdictStyle(audit.verdict)}`}>
                                                {audit.verdict === 'GREEN' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                                {audit.verdict}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <Link
                                                href={`/audit/${audit.id}/report`}
                                                className="text-slate-500 hover:text-brand-primary transition-colors p-2"
                                            >
                                                <ArrowUpRight size={24} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-xs font-bold text-slate-600 font-sans uppercase tracking-widest">
                        <p>Snapshot showing 3 of 142 records</p>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${p === 1 ? 'bg-brand-primary border-brand-primary text-brand-black shadow-lg shadow-brand-primary/20' : 'border-white/5 text-slate-600 hover:border-brand-primary/30 hover:text-white'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
