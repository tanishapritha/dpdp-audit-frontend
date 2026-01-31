'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Plus, Search, Filter, Shield,
    Calendar, FileText,
    CheckCircle, AlertTriangle,
    ArrowUpRight, Gavel, FileCheck, History, Loader2, AlertCircle, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api-client';

export default function Dashboard() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [audits, setAudits] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) return null;


    useEffect(() => {
        const fetchAudits = async () => {
            if (!isAuthenticated) return;


            try {
                setIsLoading(true);
                let data = [];
                try {
                    console.log("Registry Sync Trace [1/3]: GET /policies/");
                    const res = await apiClient.get('/policies/');
                    data = Array.isArray(res.data) ? res.data : (res.data.policies || res.data.items || []);
                } catch (e1) {
                    try {
                        console.warn("Registry Sync Trace [2/3]: GET /audits");
                        const res = await apiClient.get('/audits');
                        data = Array.isArray(res.data) ? res.data : (res.data.audits || res.data.items || []);
                    } catch (e2) {
                        try {
                            console.warn("Registry Sync Trace [3/3]: GET /policies");
                            const res = await apiClient.get('/policies');
                            data = Array.isArray(res.data) ? res.data : (res.data.policies || res.data.items || []);
                        } catch (e3) {
                            console.error("Registry Sync Phase: All discovery paths exhausted (404/Null)");
                            data = [];
                        }
                    }
                }

                setAudits(data);
            } catch (err) {
                console.error("Critical Registry Node Failure:", err);
                setAudits([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading) {
            fetchAudits();
        }
    }, [loading, isAuthenticated]);


    const getVerdictStyle = (verdict: string) => {
        switch (verdict) {
            case 'GREEN': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'YELLOW': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'RED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="h-screen bg-brand-black text-[#f0f2f5] flex flex-col overflow-hidden">
            <header className="border-b border-white/5 bg-brand-black/90 backdrop-blur-xl shrink-0">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="text-brand-primary w-6 h-6" />
                        <h1 className="text-xl font-heading tracking-tight text-white">Registry Center</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/audit" className="btn btn-primary h-10 px-6 text-xs font-bold gap-2 shadow-lg">
                            <Plus size={16} /> New Audit
                        </Link>
                        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-bold text-white leading-none mb-1">{user?.name || 'Official Auditor'}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-sans font-bold opacity-50">NODE_AU_9921</p>
                            </div>
                            <div className="w-8 h-8 rounded-sm border border-brand-primary/20 flex items-center justify-center font-heading text-lg text-brand-primary bg-brand-primary/5">
                                {user?.name?.[0] || 'A'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            <main className="flex-grow flex flex-col overflow-hidden container mx-auto px-6 py-6">
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
                    {[
                        { label: 'Total Logs', value: audits.length.toString(), icon: <FileText size={14} /> },
                        { label: 'Verified', value: audits.filter(a => a.verdict === 'GREEN').length.toString(), icon: <FileCheck size={14} />, color: 'text-emerald-500' },
                        { label: 'Avg Integrity', value: audits.length > 0 ? Math.round(audits.reduce((acc, curr) => acc + (curr.score || 0), 0) / audits.length) + '%' : '0%', icon: <Gavel size={14} /> },
                        { label: 'Baseline', value: 'DPDP-2023', icon: <Shield size={14} />, color: 'text-brand-primary' }
                    ].map((stat, i) => (
                        <div key={i} className="glass p-4 rounded-sm border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans mb-1">{stat.label}</p>
                                <p className={`text-xl font-heading ${stat.color || 'text-white'}`}>{stat.value}</p>
                            </div>
                            <div className="text-slate-700">{stat.icon}</div>
                        </div>
                    ))}
                </section>


                <div className="flex-grow flex flex-col glass rounded-sm overflow-hidden border-white/5">
                    <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.01] shrink-0">
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="text"
                                placeholder="Scan registry logs..."
                                className="w-full bg-brand-black/50 border border-white/5 rounded-sm py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-brand-primary/50 transition-all font-medium font-sans"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="h-8 px-3 rounded-sm border border-white/5 text-[10px] font-bold gap-2 text-slate-500 flex items-center hover:bg-white/5 transition-colors">
                                <Filter size={12} /> Filter
                            </button>
                            <button className="h-8 px-3 rounded-sm border border-white/5 text-[10px] font-bold gap-2 text-slate-500 flex items-center hover:bg-white/5 transition-colors">
                                <Calendar size={12} /> Timeline
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto scrollbar-thin">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10 bg-[#0d1014] shadow-sm">
                                <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                                    <th className="px-6 py-4">Fiduciary Asset</th>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Compliance Baseline</th>
                                    <th className="px-6 py-4">Integrity</th>
                                    <th className="px-6 py-4 text-right pr-10">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin text-brand-primary/40" size={20} />
                                                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">Syncing Registry Node...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : audits.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-40">
                                                <AlertCircle className="text-slate-600" size={20} />
                                                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">Zero records found in local cache.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    audits.filter(a => (a.filename || a.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((audit) => (
                                        <tr key={audit.id} className="hover:bg-white/[0.01] transition-colors group cursor-pointer" onClick={() => router.push(`/audit/run/${audit.id}`)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-brand-muted/20 rounded-sm border border-white/5 text-slate-500 group-hover:text-brand-primary transition-colors">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-heading text-white tracking-wide">{audit.filename || audit.name || 'Unnamed Doc'}</p>
                                                        <p className="text-[9px] text-slate-600 font-mono opacity-50">{audit.id.slice(0, 12)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[11px] text-slate-500 font-medium font-sans">{new Date(audit.created_at || Date.now()).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-[11px] text-slate-300 font-bold uppercase tracking-tighter opacity-70">DPDP_ACT_2023</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-white font-heading">{audit.score || 0}%</span>
                                                    <div className="w-12 h-1 bg-brand-muted/30 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${audit.score > 80 ? 'bg-emerald-500' : audit.score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${audit.score || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-6">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-bold border font-sans uppercase tracking-widest ${getVerdictStyle(audit.verdict)}`}>
                                                    {audit.verdict === 'GREEN' ? <ShieldCheck size={10} /> : <AlertTriangle size={10} />}
                                                    {audit.verdict}
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-slate-600 font-sans uppercase tracking-widest shrink-0">
                        <p>Total Records: {audits.length}</p>
                        <p>Sync Status: Live</p>
                    </div>
                </div>
            </main>
        </div>
    );

}
