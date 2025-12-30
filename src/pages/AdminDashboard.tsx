import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/client';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const usersData = await authAPI.getUsers();
                setUsers(usersData);
            } else {
                const logsData = await authAPI.getAuditLogs();
                setAuditLogs(logsData);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await authAPI.updateUser(userId, { role: newRole });
            loadData();
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const handleToggleActive = async (userId, isActive) => {
        try {
            await authAPI.updateUser(userId, { is_active: !isActive });
            loadData();
        } catch (error) {
            console.error('Failed to toggle active status:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await authAPI.deleteUser(userId);
            loadData();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getRoleBadgeClass = (role) => {
        const classes = {
            ADMIN: 'bg-red-500/20 text-red-400 border-red-500/50',
            ANALYST: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            VIEWER: 'bg-green-500/20 text-green-400 border-green-500/50',
        };
        return classes[role] || classes.VIEWER;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'users'
                                ? 'bg-primary text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'logs'
                                ? 'bg-primary text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Audit Logs
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="loader"></div>
                </div>
            ) : activeTab === 'users' ? (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Login</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((u) => (
                                    <tr key={u.user_id} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-white">{u.full_name}</div>
                                                <div className="text-sm text-gray-400">{u.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                                                disabled={u.user_id === user.user_id}
                                                className="input-field py-1 text-sm"
                                            >
                                                <option value="VIEWER">Viewer</option>
                                                <option value="ANALYST">Analyst</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(u.user_id, u.is_active)}
                                                disabled={u.user_id === user.user_id}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${u.is_active
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                                                    }`}
                                            >
                                                {u.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {formatDate(u.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {u.last_login ? formatDate(u.last_login) : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(u.user_id)}
                                                disabled={u.user_id === user.user_id}
                                                className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Resource</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {auditLogs.map((log) => (
                                    <tr key={log.log_id} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {formatDate(log.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            {log.user_id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {log.resource_type && (
                                                <div>
                                                    <span className="text-gray-500">{log.resource_type}</span>
                                                    {log.resource_id && (
                                                        <span className="text-gray-600 ml-2">#{log.resource_id.slice(0, 8)}</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {log.ip_address || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
