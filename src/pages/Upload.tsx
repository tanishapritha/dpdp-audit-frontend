import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, X, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { policyAPI } from '../api/client';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const navigate = useNavigate();

    const handleFile = (selectedFile) => {
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

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragActive(false);
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) handleFile(selectedFile);
    }, []);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
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
        <div className="max-w-3xl mx-auto py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Upload Privacy Policy</h2>
                <p className="text-text-secondary">Supported format: PDF (Max 10MB)</p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-1 p-md-4 mb-8"
            >
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${isDragActive ? 'border-accent-primary bg-accent-primary/5' : 'border-white/10 hover:border-white/20'
                        } ${file ? 'bg-green-500/5 border-green-500/30' : ''}`}
                    onClick={() => !file && document.getElementById('fileInput').click()}
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
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <div className="bg-accent-primary/10 p-4 rounded-full text-accent-primary mb-2">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold mb-1">Click or drag to upload</p>
                                    <p className="text-text-muted">Analyze your policy against DPDP compliance items</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="selected"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-4 w-full"
                            >
                                <div className="bg-green-500/10 p-4 rounded-full text-green-500 mb-2">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="flex items-center gap-3 bg-bg-primary/50 px-6 py-3 rounded-lg border border-white/5 w-full max-w-sm">
                                    <FileText className="text-accent-primary" />
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-6"
                >
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </motion.div>
            )}

            <button
                disabled={!file || isUploading}
                onClick={handleUpload}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${!file || isUploading
                    ? 'bg-white/5 text-text-muted cursor-not-allowed'
                    : 'bg-accent-primary hover:bg-accent-primary/90 text-white shadow-lg shadow-accent-primary/25 active:scale-95'
                    }`}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="animate-spin" /> Uploading & Initializing...
                    </>
                ) : (
                    <>Analyze Policy</>
                )}
            </button>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                <div className="flex gap-4">
                    <ShieldCheck className="text-accent-primary shrink-0" />
                    <p className="text-sm">End-to-end encrypted file handling. Your data is deleted after audit completion.</p>
                </div>
                <div className="flex gap-4">
                    <Zap className="text-accent-primary shrink-0" />
                    <p className="text-sm">Real-time status tracking and evidence extraction enabled by default.</p>
                </div>
            </div>
        </div>
    );
};

// Help icons etc from lucide-react
const ShieldCheck = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);

const Zap = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);

export default UploadPage;
