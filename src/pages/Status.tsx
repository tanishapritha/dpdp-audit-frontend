import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Circle, AlertCircle, FileSearch, BrainCircuit, BarChartHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { policyAPI } from '../api/client';

const StatusPage = () => {
    const { policyId } = useParams<{ policyId: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>('PENDING');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkStatus = async () => {
            if (!policyId) return;
            try {
                // Use getStatus endpoint if available, fallback to getReport
                const response = await policyAPI.getStatus(policyId).catch(() => policyAPI.getReport(policyId));
                const newStatus = response.status;
                setStatus(newStatus);

                if (newStatus === 'COMPLETED') {
                    clearInterval(interval);
                    setTimeout(() => navigate(`/report/${policyId}`), 1500);
                } else if (newStatus === 'FAILED') {
                    clearInterval(interval);
                    setError('The compliance engine encountered an error processing this document.');
                }
            } catch (err) {
                console.error(err);
                // Don't stop the interval, just show transient error
            }
        };

        checkStatus();
        interval = setInterval(checkStatus, 3000);

        return () => clearInterval(interval);
    }, [policyId, navigate]);

    const steps = [
        { id: 'PENDING', label: 'Inbound Channel Linked', icon: <CheckCircle2 size={18} /> },
        { id: 'EXTRACTING', label: 'Clause Segmentation', icon: <FileSearch size={18} /> },
        { id: 'ANALYZING', label: 'DPDP Context Mapping', icon: <BrainCircuit size={18} /> },
        { id: 'COMPLETED', label: 'Certification Finalized', icon: <BarChartHorizontal size={18} /> }
    ];

    const getStepStatus = (index: number) => {
        const statusMap: Record<string, number> = {
            'PENDING': 0,
            'EXTRACTING': 1,
            'ANALYZING': 2,
            'COMPLETED': 3,
            'FAILED': -1
        };

        const currentStepIndex = statusMap[status] ?? 1;
        if (status === 'COMPLETED') return 'completed';
        if (index < currentStepIndex) return 'completed';
        if (index === currentStepIndex) return 'loading';
        return 'pending';
    };

    return (
        <div className="max-w-xl mx-auto py-20 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 flex flex-col items-center"
            >
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-24 h-24 glass-card border-accent/20 flex items-center justify-center text-accent-gold bg-bg-dark/40">
                        <Loader2 className="animate-spin" size={48} strokeWidth={1.5} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-3 tracking-tight">Audit in Progress</h2>
                <p className="text-secondary mb-12 text-sm max-w-xs mx-auto leading-relaxed">
                    Executing multi-stage analysis protocols. Please maintain this connection.
                </p>

                <div className="w-full space-y-3 text-left max-w-sm mx-auto">
                    {steps.map((step, i) => {
                        const s = getStepStatus(i);
                        return (
                            <div key={step.id} className="flex items-center gap-4 group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${s === 'completed' ? 'bg-success/15 text-success' :
                                        s === 'loading' ? 'bg-accent-gold/15 text-accent-gold shadow-[0_0_15px_rgba(197,160,89,0.2)]' :
                                            'bg-white/5 text-muted'
                                    }`}>
                                    {s === 'completed' ? <CheckCircle2 size={16} /> :
                                        s === 'loading' ? <Loader2 size={16} className="animate-spin" /> :
                                            <Circle size={8} fill="currentColor" opacity={0.2} />}
                                </div>
                                <div className="flex-grow">
                                    <span className={`text-sm font-medium transition-colors ${s === 'pending' ? 'text-muted' : 'text-white'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                                {s === 'loading' && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] font-bold text-accent-gold uppercase tracking-tighter"
                                    >
                                        Active
                                    </motion.span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8 status-error px-6 py-4 rounded-xl flex items-center gap-4 max-w-md mx-auto"
                    >
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="text-xs font-bold text-left">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-16 flex flex-col items-center gap-4">
                <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                    Kernel Session: {policyId?.slice(0, 16)}
                </p>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                            className="w-1 h-1 bg-accent-gold rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
