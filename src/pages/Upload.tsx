import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, X, CheckCircle2, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { policyAPI } from '../api/client';

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const navigate = useNavigate();

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
            setError('File size too large. Max 10MB.');
            return;
        }
        setFile(selectedFile);
        setError(null);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) handleFile(selectedFile);
    }, []);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError(null);

        try {
            const response = await policyAPI.uploadPolicy(file);
            const { policy_id } = response;
            navigate(`/status/${policy_id}`);
        } catch (err) {
            console.error(err);
            setError('Failed to upload file. Please check your connection and try again.');
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Initialize Audit</h1>
                <p className="text-secondary">Upload your privacy policy to begin the DPDP compliance scan.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 mb-8"
            >
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${isDragActive ? 'border-accent-gold bg-accent-gold-glow' : 'border-dim hover:border-accent-gold/30'
                        } ${file ? 'border-success/30 bg-success/5' : ''}`}
                    onClick={() => !file && document.getElementById('fileInput')?.click()}
                >
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={onFileChange}
                    />

                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-6 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-accent-gold-glow flex items-center justify-center text-accent-gold">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold mb-2">Drop your policy here</p>
                                    <p className="text-secondary text-sm">PDF files only, up to 10MB</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="selected"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-6 w-full"
                            >
                                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="flex items-center gap-4 bg-bg-dark/40 px-6 py-4 rounded-xl border border-dim w-full">
                                    <FileText className="text-accent-gold" />
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-white truncate">{file.name}</p>
                                        <p className="text-xs text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {error && (
                <div className="status-error p-4 rounded-xl flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <button
                disabled={!file || isUploading}
                onClick={handleUpload}
                className="btn btn-primary w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <span className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={20} />
                        Uploading Policy...
                    </span>
                ) : (
                    "Begin Compliance Audit"
                )}
            </button>

            <div className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t border-dim">
                <div className="flex gap-4">
                    <div className="text-accent-gold"><ShieldCheck size={24} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Encrypted Tunnel</h4>
                        <p className="text-xs text-secondary leading-relaxed">Secure document handling via industry-standard protocols.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-accent-gold"><Zap size={24} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Low Latency</h4>
                        <p className="text-xs text-secondary leading-relaxed">Parallelized extraction engine for near real-time results.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
