import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShieldAlert, ShieldCheck, ShieldQuestion,
    ChevronDown, ChevronUp, FileText,
    Filter, Brain, ExternalLink, Calendar, AlertTriangle, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { policyAPI, PolicyReportResponse, RequirementAudit } from '../api/client';

const ReportPage = () => {
    const { policyId } = useParams<{ policyId: string }>();
    const [report, setReport] = useState<PolicyReportResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'RED' | 'YELLOW' | 'GREEN'>('ALL');

    useEffect(() => {
        const fetchReport = async () => {
            if (!policyId) return;
            try {
                const response = await policyAPI.getReport(policyId);
                setReport(response);
            } catch (err) {
                console.error(err);
                setError('Failed to load compliance report. It might still be processing.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [policyId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="loader"></div>
            <p className="text-secondary animate-pulse">Synthesizing audit findings...</p>
        </div>
    );

    if (error || !report) return (
        <div className="glass max-w-xl mx-auto my-20 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mx-auto mb-6">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Audit Unavailable</h2>
            <p className="text-secondary mb-8">{error || 'The requested report could not be found.'}</p>
            <button
                onClick={() => window.location.href = '/upload'}
                className="btn btn-primary"
            >
                Return to Scan
            </button>
        </div>
    );

    const filteredRequirements = report.requirements.filter(req => {
        if (filter === 'ALL') return true;
        if (filter === 'RED') return req.status === 'NOT_COVERED';
        if (filter === 'YELLOW') return req.status === 'PARTIAL';
        if (filter === 'GREEN') return req.status === 'COVERED';
        return true;
    });

    const getVerdictConfig = (verdict: string) => {
        switch (verdict) {
            case 'RED': return { color: 'text-error', bg: 'bg-error/10', icon: <ShieldAlert /> };
            case 'YELLOW': return { color: 'text-warning', bg: 'bg-warning/10', icon: <ShieldAlert /> };
            case 'GREEN': return { color: 'text-success', bg: 'bg-success/10', icon: <ShieldCheck /> };
            default: return { color: 'text-muted', bg: 'bg-white/5', icon: <ShieldQuestion /> };
        }
    };

    const overall = getVerdictConfig(report.overall_verdict);

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 glass-card text-accent-gold">
                            <FileText size={20} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Compliance Report</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-secondary text-sm">
                        <span className="flex items-center gap-1.5 px-2 py-1 glass-card border-dim">{report.filename}</span>
                        <span className="text-dim">•</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(report.evaluated_at).toLocaleDateString()}</span>
                        <span className="text-dim">•</span>
                        <span className="text-xs font-mono uppercase text-muted">ID: {report.policy_id.slice(0, 8)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 p-6 glass border-dim bg-accent-gold-glow/5">
                    <div className={`${overall.color} p-4 rounded-xl ${overall.bg} border border-current/20`}>
                        {React.cloneElement(overall.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <div>
                        <p className="text-muted text-xs font-bold uppercase tracking-widest mb-1">Safety Rating</p>
                        <p className={`text-3xl font-bold ${overall.color}`}>{report.overall_verdict} STATUS</p>
                    </div>
                    <button className="btn btn-ghost p-3 ml-4" title="Download Export">
                        <Download size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats & Filters */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 sticky top-28 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                                <Filter size={16} /> Segment Filter
                            </h3>
                            <div className="space-y-1.5">
                                {(['ALL', 'RED', 'YELLOW', 'GREEN'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between ${filter === f ? 'bg-accent-gold text-bg-dark font-bold' : 'hover:bg-white/5 text-secondary'
                                            }`}
                                    >
                                        {f === 'ALL' ? 'Total Overview' : `${f} Findings`}
                                        {filter === f && <div className="w-1.5 h-1.5 bg-bg-dark rounded-full"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                <Brain size={16} /> Verification Metrics
                            </h3>

                            <div className="glass-card p-4 bg-purple-500/5 border-purple-500/10">
                                <div className="space-y-4">
                                    <MetricBar
                                        label="Faithfulness"
                                        value={report.ragas_faithfulness || 0}
                                        color="bg-purple-500"
                                    />
                                    <MetricBar
                                        label="Answer Relevancy"
                                        value={report.ragas_answer_relevancy || 0}
                                        color="bg-blue-500"
                                    />
                                </div>
                                <p className="text-[10px] text-muted mt-4 leading-tight italic">
                                    Validated via RAGAS algorithmic framework against source ground truth.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Audit Items */}
                <main className="lg:col-span-3 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredRequirements.map((req, index) => (
                            <RequirementCard
                                key={req.requirement_id}
                                req={req}
                                isExpanded={expandedId === req.requirement_id}
                                onToggle={() => setExpandedId(expandedId === req.requirement_id ? null : req.requirement_id)}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

const MetricBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div>
        <div className="flex justify-between text-[11px] font-bold mb-1.5">
            <span className="text-secondary">{label}</span>
            <span className="text-white">{(value * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value * 100}%` }}
                className={`${color} h-full`}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
    </div>
);

const RequirementCard = ({ req, isExpanded, onToggle, index }: { req: RequirementAudit, isExpanded: boolean, onToggle: () => void, index: number }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COVERED': return 'border-l-success text-success bg-success/5';
            case 'PARTIAL': return 'border-l-warning text-warning bg-warning/5';
            case 'NOT_COVERED': return 'border-l-error text-error bg-error/5';
            default: return 'border-l-dim';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card overflow-hidden border-l-4 transition-all ${getStatusStyles(req.status)} ${isExpanded ? 'ring-1 ring-accent-gold/20 translate-x-1' : ''
                }`}
        >
            <div
                className="p-6 cursor-pointer flex justify-between items-start gap-4"
                onClick={onToggle}
            >
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-mono font-bold text-accent-gold px-2 py-0.5 glass-card border-accent/20">
                            REQ #{req.requirement_id}
                        </span>
                        <div className={`badge text-[10px] ${req.status === 'COVERED' ? 'status-success' : req.status === 'PARTIAL' ? 'status-warning' : 'status-error'
                            }`}>
                            {req.status.replace('_', ' ')}
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                        Requirement: {req.requirement_id}
                    </h3>
                    <p className="text-secondary text-sm line-clamp-2 italic">
                        {req.reason}
                    </p>
                </div>
                <div className="p-2 text-muted mt-1">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-dim bg-bg-dark/20"
                    >
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-accent-gold uppercase tracking-widest flex items-center gap-2">
                                    <Brain size={14} /> Synthetic Reasoning
                                </h4>
                                <div className="p-5 glass-card bg-bg-dark/40 border-dim text-secondary text-sm leading-relaxed">
                                    {req.reason}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-accent-gold uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Extracted Evidence
                                </h4>
                                {req.evidence.length > 0 ? (
                                    <div className="grid gap-3">
                                        {req.evidence.map((text, i) => (
                                            <div key={i} className="glass-card p-4 border-dim text-sm text-white/90">
                                                <p className="mb-3 leading-relaxed">"{text}"</p>
                                                <div className="flex justify-between items-center pt-3 border-t border-dim/50">
                                                    <span className="text-[10px] font-mono text-muted bg-white/5 px-2 py-0.5 rounded">PAGE {req.page_numbers[i] || 'N/A'}</span>
                                                    <button className="flex items-center gap-1.5 text-[10px] text-accent-gold font-bold hover:underline">
                                                        VIEW SOURCE <ExternalLink size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-10 text-center border-2 border-dashed border-dim rounded-2xl text-muted text-sm italic">
                                        Negative result: No direct policy clauses match this requirement.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ReportPage;
