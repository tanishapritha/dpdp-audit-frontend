import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShieldAlert, ShieldCheck, ShieldQuestion,
    ChevronDown, ChevronUp, FileText,
    Search, Filter, History, Brain,
    ExternalLink, Calendar, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { policyAPI } from '../api/client';

const ReportPage = () => {
    const { policyId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState('ALL'); // ALL, RED, YELLOW, GREEN

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await policyAPI.getReport(policyId);
                setReport(response);
            } catch (err) {
                console.error(err);
                setError('Failed to load report. It might still be processing or was deleted.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [policyId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="pulse bg-accent-primary/20 p-4 rounded-full">
                <History className="text-accent-primary animate-spin" size={32} />
            </div>
            <p className="text-text-secondary">Generating report dashboard...</p>
        </div>
    );

    if (error || !report) return (
        <div className="glass max-w-xl mx-auto my-20 p-12 text-center">
            <AlertTriangle className="text-red-500 mx-auto mb-6" size={48} />
            <h2 className="text-2xl font-bold mb-4">Report Not Found</h2>
            <p className="text-text-secondary mb-8">{error}</p>
            <button
                onClick={() => window.location.href = '/upload'}
                className="bg-accent-primary px-6 py-3 rounded-lg font-bold"
            >
                Go to Upload
            </button>
        </div>
    );

    const getVerdictStyles = (verdict) => {
        switch (verdict) {
            case 'RED': return { color: 'text-status-red', bg: 'bg-status-red/10', border: 'border-status-red/20', icon: <ShieldAlert /> };
            case 'YELLOW': return { color: 'text-status-yellow', bg: 'bg-status-yellow/10', border: 'border-status-yellow/20', icon: <ShieldAlert /> };
            case 'GREEN': return { color: 'text-status-green', bg: 'bg-status-green/10', border: 'border-status-green/20', icon: <ShieldCheck /> };
            default: return { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/10', icon: <ShieldQuestion /> };
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COVERED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-500 border border-green-500/30">COVERED</span>;
            case 'PARTIAL': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">PARTIAL</span>;
            case 'NOT_COVERED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/30">NOT COVERED</span>;
            default: return null;
        }
    };

    const filteredRequirements = report.requirements.filter(req => {
        if (filter === 'ALL') return true;
        if (filter === 'RED') return req.status === 'NOT_COVERED';
        if (filter === 'YELLOW') return req.status === 'PARTIAL';
        if (filter === 'GREEN') return req.status === 'COVERED';
        return true;
    });

    const overall = getVerdictStyles(report.overall_verdict);

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Audit Report</h1>
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                        <span className="flex items-center gap-1.5"><FileText size={16} /> {report.filename}</span>
                        <span className="text-white/10">|</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(report.evaluated_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-6 p-6 rounded-2xl glass border-t-4 ${overall.border.replace('/20', '/100').replace('border-', 'border-t-')}`}>
                    <div className={`${overall.color} p-3 rounded-xl ${overall.bg}`}>
                        {React.cloneElement(overall.icon, { size: 32 })}
                    </div>
                    <div>
                        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1">Overall Verdict</p>
                        <p className={`text-3xl font-black ${overall.color}`}>{report.overall_verdict}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 sticky top-28">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Filter size={18} /> Filter Analysis
                        </h3>
                        <div className="space-y-2">
                            {['ALL', 'RED', 'YELLOW', 'GREEN'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${filter === f ? 'bg-accent-primary text-white' : 'hover:bg-white/5 text-text-secondary'
                                        }`}
                                >
                                    {f === 'ALL' ? 'All Requirements' : f + ' Status'}
                                    {filter === f && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="bg-accent-primary/5 p-4 rounded-xl border border-accent-primary/10 mb-4">
                                <p className="text-xs font-bold text-accent-primary uppercase mb-2">Audit Stats</p>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-text-secondary">Requirements</span>
                                    <span className="text-white font-mono">{report.requirements.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Coverage</span>
                                    <span className="text-green-500 font-mono">
                                        {Math.round((report.requirements.filter(r => r.status === 'COVERED').length / report.requirements.length) * 100)}%
                                    </span>
                                </div>
                            </div>

                            <div className="bg-purple-500/5 p-4 rounded-xl border border-purple-500/10">
                                <p className="text-xs font-bold text-purple-400 uppercase mb-2 flex items-center gap-1.5">
                                    <Brain size={14} /> AI Quality (RAGAS)
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-text-secondary">Faithfulness</span>
                                            <span className="text-white font-mono">{report.ragas_faithfulness ? (report.ragas_faithfulness * 100).toFixed(1) + '%' : 'N/A'}</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                            <div
                                                className="bg-purple-500 h-full transition-all duration-1000"
                                                style={{ width: `${(report.ragas_faithfulness || 0) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-text-secondary">Answer Relevancy</span>
                                            <span className="text-white font-mono">{report.ragas_answer_relevancy ? (report.ragas_answer_relevancy * 100).toFixed(1) + '%' : 'N/A'}</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                            <div
                                                className="bg-blue-500 h-full transition-all duration-1000"
                                                style={{ width: `${(report.ragas_answer_relevancy || 0) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requirements List */}
                <div className="lg:col-span-3 space-y-4">
                    {filteredRequirements.map((req, index) => (
                        <motion.div
                            layout
                            key={req.requirement_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`glass overflow-hidden border-l-4 transition-all ${expandedId === req.requirement_id ? 'border-l-accent-primary ring-1 ring-accent-primary/20' :
                                req.status === 'NOT_COVERED' ? 'border-l-status-red' :
                                    req.status === 'PARTIAL' ? 'border-l-status-yellow' :
                                        'border-l-status-green'
                                }`}
                        >
                            <div
                                className="p-6 cursor-pointer flex justify-between items-start gap-4 hover:bg-white/[0.02]"
                                onClick={() => setExpandedId(expandedId === req.requirement_id ? null : req.requirement_id)}
                            >
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-mono font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">
                                            {req.requirement_id}
                                        </span>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{req.requirement_id.split('-').length > 1 ? `DPDP Compliance Check` : req.requirement_id}</h3>
                                    <p className="text-text-secondary text-sm max-w-2xl line-clamp-2">
                                        {req.reason}
                                    </p>
                                </div>
                                <div className="p-2 text-text-muted hover:text-white transition-colors">
                                    {expandedId === req.requirement_id ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === req.requirement_id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5"
                                    >
                                        <div className="p-8 bg-bg-primary/30">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-xs font-bold text-accent-primary uppercase mb-4 flex items-center gap-2">
                                                        <Brain size={14} /> AI Analysis & Reasoning
                                                    </h4>
                                                    <div className="glass bg-bg-primary p-5 border-white/5 italic text-text-primary leading-relaxed">
                                                        "{req.reason}"
                                                    </div>

                                                    <div className="mt-6 flex items-center gap-4 text-xs text-text-muted">
                                                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> Evidence Verified</span>
                                                        <span className="flex items-center gap-1.5"><Brain size={14} className="text-accent-primary" /> OpenAI model-4-mini</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-accent-primary uppercase mb-4 flex items-center gap-2">
                                                        <FileText size={14} /> Matched Evidence
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {req.evidence.length > 0 ? req.evidence.map((text, i) => (
                                                            <div key={i} className="text-sm p-4 bg-white/5 rounded-lg border border-white/5 relative group">
                                                                <p className="line-clamp-3 group-hover:line-clamp-none transition-all">{text}</p>
                                                                <div className="mt-2 flex justify-between items-center text-xs text-text-muted">
                                                                    <span className="bg-white/10 px-2 py-0.5 rounded text-white/50">Page {req.page_numbers[i] || '?'}</span>
                                                                    <button className="flex items-center gap-1 text-accent-primary hover:underline">
                                                                        View in doc <ExternalLink size={10} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )) : (
                                                            <div className="text-sm p-8 text-center text-text-muted border border-dashed border-white/10 rounded-xl">
                                                                No direct policy matches found for this requirement.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
