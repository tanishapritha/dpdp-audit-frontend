import React, { useState } from 'react';
import { Shield, Github, User, LogOut, Settings, UserCog, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/' },
        { name: 'Audit Scan', path: '/upload' },
    ];

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'status-error';
            case 'ANALYST': return 'status-warning';
            default: return 'status-success';
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="glass sticky top-4 z-50 mx-4 mt-4 px-6 py-3 flex justify-between items-center bg-card">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 glass-card border-accent bg-accent-gold-glow">
                        <Shield className="text-accent-gold w-6 h-6 transform group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-heading">PolicyPulse</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-accent-gold' : 'text-secondary hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {hasRole('ADMIN') && (
                        <Link
                            to="/admin"
                            className={`text-sm font-medium flex items-center gap-1 transition-colors ${location.pathname === '/admin' ? 'text-accent-gold' : 'text-secondary hover:text-white'
                                }`}
                        >
                            <UserCog size={16} />
                            Admin
                        </Link>
                    )}

                    <div className="w-px h-6 bg-border-dim mx-2" />

                    <a
                        href="https://github.com/tanishapritha/dpdp-audit-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-white"
                    >
                        <Github size={20} />
                    </a>

                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full glass-card hover:border-accent transition-all"
                            >
                                <span className="text-sm font-medium text-white px-2">{user.full_name}</span>
                                <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-bg-dark font-bold text-xs">
                                    {user.full_name.charAt(0)}
                                </div>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-4 w-64 glass p-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="pb-3 mb-3 border-b border-dim">
                                        <p className="text-white font-bold">{user.full_name}</p>
                                        <p className="text-secondary text-xs">{user.email}</p>
                                        <div className={`mt-2 inline-block badge ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                            <Settings size={16} />
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass m-4 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-medium text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="text-lg font-medium text-error flex items-center gap-2">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow container py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-dim py-8 text-center text-muted text-sm">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
                    <p>© 2025 PolicyPulse AI. All regulatory rights observed.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-white transition-colors">Audit Methodology</a>
                        <a href="#" className="hover:text-white transition-colors">API Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
