import React, { useState } from 'react';
import { Shield, Github, Info, User, LogOut, Settings, UserCog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleBadgeClass = (role) => {
        const classes = {
            ADMIN: 'bg-red-500/20 text-red-400',
            ANALYST: 'bg-blue-500/20 text-blue-400',
            VIEWER: 'bg-green-500/20 text-green-400',
        };
        return classes[role] || classes.VIEWER;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="glass sticky top-0 z-50 px-6 py-4 mx-4 my-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <Shield className="text-accent-primary w-8 h-8" strokeWidth={2.5} />
                    <span className="text-xl font-bold tracking-tight text-white">PolicyPulse</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-text-secondary hover:text-white transition-colors no-underline">Home</Link>
                    <Link to="/upload" className="text-text-secondary hover:text-white transition-colors no-underline">Scan</Link>

                    {hasRole('ADMIN') && (
                        <Link to="/admin" className="text-text-secondary hover:text-white transition-colors no-underline flex items-center gap-1">
                            <UserCog size={18} />
                            Admin
                        </Link>
                    )}

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-white transition-colors"
                    >
                        <Github width={20} />
                    </a>

                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                            >
                                <User size={18} className="text-primary" />
                                <span className="text-white text-sm">{user.full_name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getRoleBadgeClass(user.role)}`}>
                                    {user.role}
                                </span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 glass-card p-2">
                                    <div className="px-3 py-2 border-b border-gray-700 mb-2">
                                        <p className="text-white font-medium">{user.full_name}</p>
                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors no-underline"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={16} />
                                        Profile Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="glass m-4 p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm">
                <div>© 2025 PolicyPulse Audit Engine</div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-text-secondary">Privacy</a>
                    <a href="#" className="hover:text-text-secondary">Terms</a>
                    <a href="#" className="hover:text-text-secondary flex items-center gap-1">
                        <Info size={14} /> Documentation
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
