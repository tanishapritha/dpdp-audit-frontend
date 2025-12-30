import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark px-4">
            <div className="scanline"></div>

            <div className="glass-card p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">DPDP Audit</h1>
                    <p className="text-gray-400">Enterprise Compliance Platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="you@company.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="loader-small mr-2"></div>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <p className="text-sm font-medium text-gray-400 mb-4 text-center">Quick Login (Test Roles)</p>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => { setFormData({ email: 'admin@dpdp.com', password: 'admin123' }) }}
                            className="text-xs py-2 px-1 bg-primary/10 border border-primary/30 rounded text-primary hover:bg-primary/20 transition-all"
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => { setFormData({ email: 'analyst@dpdp.com', password: 'analyst123' }) }}
                            className="text-xs py-2 px-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 hover:bg-yellow-500/20 transition-all"
                        >
                            Analyst
                        </button>
                        <button
                            onClick={() => { setFormData({ email: 'viewer@dpdp.com', password: 'viewer123' }) }}
                            className="text-xs py-2 px-1 bg-blue-500/10 border border-blue-500/30 rounded text-blue-500 hover:bg-blue-500/20 transition-all"
                        >
                            Viewer
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-light transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-500 text-center">
                        Protected by enterprise-grade security
                    </p>
                </div>
            </div>
        </div>
    );
}
