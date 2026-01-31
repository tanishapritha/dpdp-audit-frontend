'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Loader2, AlertTriangle, Cpu, ArrowRight, Gavel } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api-client';

export default function LoginPage() {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('wordpass321');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);


            const response = await apiClient.post('/login/access-token', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, token_type, user: backendUser } = response.data;
            const token = access_token || response.data.token;

            const finalUser = backendUser || {
                id: 'current-user',
                email: email,
                name: email.split('@')[0],
                role: 'Auditor'
            };

            if (token) {
                login(token, finalUser);
            } else {
                throw new Error("Token missing from server response");
            }
        } catch (err: any) {
            console.error("Login Error Details:", err);
            setError(err.response?.data?.detail || 'Verification failure. Access denied by Security Protocol.');
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_#11151c_0%,_transparent_100%)] selection:bg-brand-primary/20">
            <div className="absolute top-12 flex items-center gap-3">
                <Shield className="text-brand-primary w-10 h-10" />
                <span className="text-3xl font-heading tracking-tight text-white italic">PolicyPulse</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="glass p-12 rounded-sm space-y-10 border-white/5 shadow-2xl">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-heading text-white italic tracking-tight">Auditor Verification</h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Official Access Gateway // NODE_AU_9921</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 pl-1 uppercase tracking-widest font-sans">Authorized Identifier</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-[#0d1117] border border-white/5 rounded-sm py-4 pl-12 pr-4 text-white focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10 outline-none transition-all placeholder:text-slate-800 font-medium font-sans"
                                        placeholder="official@node.gov"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end pl-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-sans">Access Key</label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-[#0d1117] border border-white/5 rounded-sm py-4 pl-12 pr-4 text-white focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10 outline-none transition-all placeholder:text-slate-800 font-medium font-sans"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-sm text-[10px] font-bold flex items-center gap-2 font-sans uppercase tracking-wider">
                                <AlertTriangle size={14} /> {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 text-sm font-bold gap-3 rounded-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>Sign and Authorize <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>


                    <div className="flex items-center gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                        <div className="bg-brand-primary/10 p-2.5 rounded-lg border border-brand-primary/20">
                            <Gavel className="text-brand-primary" size={18} />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium font-sans">
                            Access is subject to DPDP Sec 8. Unauthorized attempts are logged and transmitted to the regulatory oversight node.
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4 text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold font-sans">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Cpu size={12} /> SYSTEM_READY</span>
                        <span className="flex items-center gap-1.5 text-emerald-500/50"><Shield size={12} /> SECURE_LINK_LINK_ACTIVE</span>
                    </div>
                    <p className="opacity-50">© 2026 PolicyPulse AI Infrastructure</p>
                </div>
            </motion.div>
        </div>
    );
}
