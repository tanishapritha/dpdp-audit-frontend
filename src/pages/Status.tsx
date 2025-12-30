import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Circle, AlertCircle, FileSearch, BrainCircuit, BarChartHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { policyAPI } from '../api/client';

const StatusPage = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('PENDING'); // PENDING, PROCESSING, COMPLETED, FAILED
    const [error, setError] = useState(null);

    useEffect(() => {
        let interval;

        const checkStatus = async () => {
            try {
                const response = await policyAPI.getReport(policyId);
                const { status: newStatus } = response;
                setStatus(newStatus);

                if (newStatus === 'COMPLETED') {
                    clearInterval(interval);
                    setTimeout(() => navigate(`/report/${policyId}`), 1000);
                } else if (newStatus === 'FAILED') {
                    clearInterval(interval);
                    setError('Processing failed. Please try again with a different document.');
                }
            } catch (err) {
                console.error(err);
                setError('Connection lost. Attempting to reconnect...');
            }
        };

        checkStatus();
        interval = setInterval(checkStatus, 3000);

        return () => clearInterval(interval);
    }, [policyId, navigate]);

    const steps = [
        { id: 'PENDING', label: 'File Uploaded', icon: <CheckCircle2 size={18} /> },
        { id: 'PROCESSING_EXTRACT', label: 'Extracting Clauses', icon: <FileSearch size={18} /> },
        { id: 'PROCESSING_MATCH', label: 'AI Verification', icon: <BrainCircuit size={18} /> },
        { id: 'COMPLETED', label: 'Report Ready', icon: <BarChartHorizontal size={18} /> }
    ];

    const getStepStatus = (stepId, index) => {
        if (status === 'COMPLETED') return 'completed';
        if (status === 'FAILED') return 'failed';

        const statusMap = {
            'PENDING': 0,
            'PROCESSING': 2, // Map PROCESSING to higher step
            'COMPLETED': 3
        };

        const currentStepIndex = statusMap[status] || 1;
        if (index < currentStepIndex) return 'completed';
        if (index === currentStepIndex) return 'loading';
        return 'pending';
    };

    return (
        <div className="max-w-2xl mx-auto py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-12 flex flex-col items-center"
            >
                <div className="relative mb-10">
                    <div className="pulse absolute inset-0 bg-accent-primary/20 rounded-full blur-xl"></div>
                    <div className="relative bg-bg-primary border border-white/10 p-6 rounded-full text-accent-primary">
                        <Loader2 className="animate-spin" size={48} strokeWidth={2.5} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">Analyzing Your Policy</h2>
                <p className="text-text-secondary mb-12 max-w-md">
                    Our AI engines are scanning your document for DPDP compliance matches.
                    This usually takes between 30-60 seconds.
                </p>

                <div className="w-full space-y-4 text-left max-w-sm">
                    {steps.map((step, i) => {
                        const s = getStepStatus(step.id, i);
                        return (
                            <div key={step.id} className="flex items-center gap-4">
                                <div className={`p-1.5 rounded-full ${s === 'completed' ? 'bg-green-500/20 text-green-500' :
                                    s === 'loading' ? 'bg-accent-primary/20 text-accent-primary animate-pulse' :
                                        'bg-white/5 text-text-muted'
                                    }`}>
                                    {s === 'completed' ? <CheckCircle2 size={18} /> :
                                        s === 'loading' ? <Loader2 size={18} className="animate-spin" /> :
                                            <Circle size={18} />}
                                </div>
                                <div className="flex-grow">
                                    <span className={`font-medium ${s === 'pending' ? 'text-text-muted' : 'text-text-primary'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {s === 'loading' && <span className="text-xs text-accent-primary font-mono font-bold">IN PROGRESS</span>}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center justify-center gap-3"
                    >
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-20 flex flex-col items-center gap-4 text-text-muted">
                <p className="text-sm">Policy ID: <span className="font-mono text-xs">{policyId}</span></p>
                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            className="w-1.5 h-1.5 bg-accent-primary rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Help icons etc from lucide-react
const AnimatePresence = ({ children }) => children; // Simple stub if motion not fully ready

export default StatusPage;
