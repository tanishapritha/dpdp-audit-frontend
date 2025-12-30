import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    user_id: string;
    email: string;
    full_name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<{ success: boolean }>;
    register: () => Promise<{ success: boolean }>;
    logout: () => void;
    updateUser: () => void;
    hasRole: (role: string) => boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        user_id: '00000000-0000-0000-0000-000000000001',
        email: 'demo@example.com',
        full_name: 'Demo User',
        role: 'ADMIN'
    });
    const [loading] = useState(false);

    const login = async () => ({ success: true });
    const register = async () => ({ success: true });
    const logout = () => { setUser(null); };
    const updateUser = () => { };
    const hasRole = (role: string) => user?.role === role;

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
