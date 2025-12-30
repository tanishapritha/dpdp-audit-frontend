import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register: authRegister } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await authRegister(); // Mock register
            navigate('/');
        } catch (err) {
            setError('Registration failed. Please contact your system administrator.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark">
            <div className="absolute top-10 left-10">
                <Link to="/" className="flex items-center gap-2 group">
                    <Shield className="text-accent-gold w-6 h-6" />
                    <span className="text-xl font-bold text-white font-heading">PolicyPulse</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass p-10 space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Node Registration</h1>
                        <p className="text-secondary text-sm">Create an authorized auditor account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-gold transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-bg-dark/50 border border-dim rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 outline-none transition-all"
                                        placeholder="Auditor Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest pl-1">Entity Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-gold transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-bg-dark/50 border border-dim rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 outline-none transition-all"
                                        placeholder="name@enterprise.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest pl-1">Secret Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-gold transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-bg-dark/50 border border-dim rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 outline-none transition-all"
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="status-error p-3 rounded-lg text-xs font-bold">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={isSubmitting}
                            className="btn btn-primary w-full py-4 rounded-xl text-lg font-bold gap-2 mt-4"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Register Authorized Node <CheckCircle size={18} /></>}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-muted text-sm">
                            Already authorized? <Link to="/login" className="text-accent-gold font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
