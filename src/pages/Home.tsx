import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Lock, Database, Search, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center gap-24 py-16">
            {/* Hero Section */}
            <section className="text-center max-w-5xl px-4 flex flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="bg-accent-primary/5 text-accent-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-accent-primary/20 mb-8 inline-block">
                        Digital Personal Data Protection (DPDP) Audit System
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-8 leading-tight text-white">
                        Enterprise Compliance <br />
                        <span className="text-accent-primary">Verification Engine</span>
                    </h1>
                    <p className="text-text-secondary text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                        Automate the auditing of privacy policies against the DPDP Act 2023. Our advanced RAG pipeline
                        ensures legal precision with immutable evidence extraction and deterministic risk scoring.
                    </p>
                    <div className="flex gap-6 justify-center">
                        <button
                            onClick={() => navigate('/upload')}
                            className="bg-accent-primary hover:bg-accent-primary/90 text-bg-primary px-10 py-4 rounded-lg font-black text-lg flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-accent-primary/20"
                        >
                            Initialize Audit <ArrowRight size={20} />
                        </button>
                        <button className="glass hover:bg-white/5 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all border border-white/10">
                            Technical Whitepaper
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Advanced RAG Infrastructure */}
            <section className="w-full max-w-6xl px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Advanced RAG Infrastructure</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Built on a specialized Retrieval-Augmented Generation stack for legal precision and hallucination-free auditing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: <Database className="text-accent-primary" />,
                            title: "LlamaIndex Core",
                            desc: "Hierarchical indexing and advanced query orchestration for structured legal analysis."
                        },
                        {
                            icon: <Search className="text-accent-primary" />,
                            title: "Hybrid Retrieval",
                            desc: "Combines dense vector search with BM25 keyword matching for semantic & lexical precision."
                        },
                        {
                            icon: <FileText className="text-accent-primary" />,
                            title: "Metadata Post-Filtering",
                            desc: "Attribute-aware retrieval ensuring evidence is strictly bound to valid policy sections."
                        },
                        {
                            icon: <CheckCircle2 className="text-accent-primary" />,
                            title: "Faithfulness Verification",
                            desc: "Triple-check verification gate ensuring zero hallucinations in compliance verdicts."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass p-8 flex flex-col gap-4 border-b-2 border-b-accent-primary/50"
                        >
                            <div className="bg-accent-primary/5 w-12 h-12 rounded-lg flex items-center justify-center border border-accent-primary/20">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white">{item.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* DPDP Specific Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                {[
                    {
                        title: "Phase 1: Ingestion",
                        metrics: ["OCR-Ready Text Extraction", "Page-level Segmentation", "Structure Preservation"]
                    },
                    {
                        title: "Phase 2: Analysis",
                        metrics: ["Cross-Encoder Re-ranking", "CoT Reasoning Pathways", "Severity Calculation"]
                    },
                    {
                        title: "Phase 3: Certification",
                        metrics: ["Immutable Audit Logging", "Evidence Context Binding", "JSON Export Ready"]
                    }
                ].map((p, i) => (
                    <div key={i} className="bg-bg-secondary/50 p-8 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-accent-primary mb-6 uppercase tracking-widest text-xs">{p.title}</h4>
                        <ul className="space-y-4">
                            {p.metrics.map((m, j) => (
                                <li key={j} className="flex items-center gap-3 text-sm text-text-secondary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Final CTA / Quote */}
            <section className="max-w-4xl w-full text-center py-20 border-y border-white/5 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <p className="text-2xl font-medium text-text-primary mb-8 leading-relaxed px-4">
                    "Regulatory compliance is no longer a sampling exercise. It requires deterministic,
                    AI-driven verification across every clause."
                </p>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-white font-bold text-lg tracking-tight">Legal Compliance Team</span>
                    <span className="text-text-muted text-sm uppercase tracking-widest">PolicyPulse Enterprise</span>
                </div>
            </section>
        </div>
    );
};

export default Home;
