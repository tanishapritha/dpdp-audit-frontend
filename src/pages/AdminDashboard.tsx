import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// @ts-ignore
import { authAPI } from '../api/client';
import { UserCog, History, User as UserIcon, Shield, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                // Mocking user data as per the API structure
                const usersData = await authAPI.getUsers().catch(() => [
                    { user_id: '1', full_name: 'Admin User', email: 'admin@policy.ai', role: 'ADMIN', is_active: true, created_at: new Date().toISOString() },
                    { user_id: '2', full_name: 'Analyst One', email: 'analyst@policy.ai', role: 'ANALYST', is_active: true, created_at: new Date().toISOString() }
                ]);
                setUsers(usersData);
            } else {
                const logsData = await authAPI.getAuditLogs().catch(() => [
                    { log_id: 'l1', timestamp: new Date().toISOString(), user_id: 'admin@policy.ai', action: 'POLICY_UPLOAD', resource_type: 'POLICY', resource_id: 'p123', ip_address: '192.168.1.1' }
                ]);
                setAuditLogs(logsData);
            }
        } catch (error) {
            console.error('Failed to load admin data:', error);
        }
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-10 py-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Internal Controls</h1>
                    <p className="text-secondary text-sm">Manage system access and review immutable audit logs.</p>
                </div>

                <div className="flex bg-bg-dark/40 p-1 rounded-xl border border-dim">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-accent-gold text-bg-dark' : 'text-muted hover:text-white'
                            }`}
                    >
                        <UserIcon size={16} /> Directory
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'logs' ? 'bg-accent-gold text-bg-dark' : 'text-muted hover:text-white'
                            }`}
                    >
                        <History size={16} /> System Logs
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center py-32 gap-4">
                    <div className="loader"></div>
                    <p className="text-muted text-sm animate-pulse">Retrieving vault data...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-dim bg-white/[0.02]">
                                    {activeTab === 'users' ? (
                                        <>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Authorized User</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Role Assignment</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Onboarded</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted text-right">Settings</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Event Horizon</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Subject</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Action</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">Target Resource</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted">IP Vector</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dim/50">
                                {activeTab === 'users' ? users.map((u) => (
                                    <tr key={u.user_id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold border border-accent-gold/20">
                                                    {u.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{u.full_name}</div>
                                                    <div className="text-xs text-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-1.5 badge ${u.role === 'ADMIN' ? 'status-error' : u.role === 'ANALYST' ? 'status-warning' : 'status-success'
                                                }`}>
                                                <Shield size={10} /> {u.role}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted'}`} />
                                                <span className="text-sm text-white">{u.is_active ? 'Active' : 'Deactivated'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-secondary">
                                            {formatDate(u.created_at)}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-muted hover:text-error transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : auditLogs.map((log) => (
                                    <tr key={log.log_id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6 text-xs font-mono text-secondary">
                                            {formatDate(log.timestamp)}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-white font-medium">
                                            {log.user_id}
                                        </td>
                                        <td className="px-8 py-6 text-xs">
                                            <span className="bg-accent-gold/5 text-accent-gold px-2 py-1 rounded border border-accent-gold/10 font-bold uppercase tracking-tighter">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-secondary">
                                            <span className="text-muted">{log.resource_type}</span>
                                            <span className="ml-2 font-mono text-dim">#{log.resource_id.slice(0, 8)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-mono text-muted">
                                            {log.ip_address}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {!loading && activeTab === 'logs' && (
                <div className="flex items-center gap-3 p-4 glass-card bg-error/5 border-error/20 text-error text-xs">
                    <ShieldAlert size={16} />
                    <span>Audit logs are immutable and cryptographically signed. Local modifications are prohibited.</span>
                </div>
            )}
        </div>
    );
}
