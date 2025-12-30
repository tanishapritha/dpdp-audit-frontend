import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Lock, Database, Search, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Database className="text-accent-gold" />,
            title: "Policy Ingestion",
            desc: "Automated OCR and structure preservation for complex privacy documents."
        },
        {
            icon: <Search className="text-accent-gold" />,
            title: "Intelligent Retrieval",
            desc: "Hybrid search combining semantic and lexical analysis for evidence extraction."
        },
        {
            icon: <FileText className="text-accent-gold" />,
            title: "Clause Analysis",
            desc: "Precise mapping of policy text against DPDP legal requirements."
        },
        {
            icon: <CheckCircle2 className="text-accent-gold" />,
            title: "Risk Certification",
            desc: "Deterministic scoring and audit logs with immutable evidence binding."
        }
    ];

    return (
        <div className="flex flex-col gap-24 py-16">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 bg-accent-gold-glow border border-accent-gold/20 px-4 py-1.5 rounded-full mb-8">
                        <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                        <span className="text-xs font-bold text-accent-gold uppercase tracking-widest">
                            DPDP Act 2023 Compliance Engine
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Audit Your Privacy <br />
                        <span className="text-accent-gold">Infrastructure</span>
                    </h1>

                    <p className="text-secondary text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        The definitive platform for verifying digital personal data protection compliance.
                        Upload your policies for automated auditing and risk certification.
                    </p>

                    <div className="flex flex-wrap gap-6 justify-center">
                        <button
                            onClick={() => navigate('/upload')}
                            className="btn btn-primary px-10 py-4 text-lg gap-3"
                        >
                            Start New Audit <ArrowRight size={20} />
                        </button>
                        <button className="btn btn-ghost px-10 py-4 text-lg">
                            System Architecture
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Core Capability Grid */}
            <section className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl mb-4">Core Engine Capabilities</h2>
                    <p className="text-secondary max-w-2xl mx-auto">
                        Precision engineering designed for regulatory compliance and legal verification.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 flex flex-col gap-4"
                        >
                            <div className="w-12 h-12 rounded-lg bg-accent-gold/5 border border-accent-gold/10 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold">{item.title}</h3>
                            <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Verification Steps */}
            <section className="container">
                <div className="glass p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 blur-[100px] -mr-32 -mt-32" />

                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl mb-6">Deterministic Auditing</h2>
                            <p className="text-secondary mb-8 leading-relaxed">
                                Our engine moves beyond probabilistic AI. By utilizing specialized retrieval
                                gateways and verification logic, every compliance status is backed by
                                direct policy evidence.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Immutable audit trail for every finding",
                                    "Page-level context for all extracted evidence",
                                    "Zero-hallucination verification pipeline"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-secondary">
                                        <ShieldCheck size={18} className="text-accent-gold" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
                            <div className="glass-card p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">2023</div>
                                <div className="text-xs text-muted uppercase tracking-wider">DPDP Ready</div>
                            </div>
                            <div className="glass-card p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">100%</div>
                                <div className="text-xs text-muted uppercase tracking-wider">Evidence Based</div>
                            </div>
                            <div className="glass-card p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">~3s</div>
                                <div className="text-xs text-muted uppercase tracking-wider">Process Time</div>
                            </div>
                            <div className="glass-card p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                                <div className="text-xs text-muted uppercase tracking-wider">Monitoring</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="text-center py-16 border-t border-dim">
                <h2 className="text-2xl mb-8">Ready to secure your compliance status?</h2>
                <button
                    onClick={() => navigate('/upload')}
                    className="btn btn-primary px-12 py-4"
                >
                    Get Started Now
                </button>
            </section>
        </div>
    );
};

export default Home;
