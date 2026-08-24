// src/auth/context/AuthProvider.tsx

import { createContext, ReactNode, useContext, useState, useCallback, useMemo } from "react";
import { LoginData } from "../response/loginResponseSchema";
import { authService } from "../services/authService"; // Import service

type AuthContextType = {
    user: LoginData | null;
    isAuthenticated: boolean;
    login: (userData: LoginData, token: string) => void;
    relogin: (userData?: LoginData, token?: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State hanya mengambil nilai awal dari service
    const [user, setUser] = useState<LoginData | null>(() => authService.getUser());

    const login = useCallback((userData: LoginData, token: string) => {
        authService.startSession(userData, token);
        setUser(userData);
    }, []);

    const relogin = useCallback((userData?: LoginData, token?: string) => {
        // Panggil service untuk update storage
        authService.updateSession(userData, token);
        // Jika data user baru diberikan, update state
        if (userData) {
            setUser(userData);
        }
    }, []);

    const logout = useCallback(() => {
        authService.clearSession();
        setUser(null);
    }, []);

    const hasRole = useCallback((role: string): boolean => {
        return user?.roles.some(r => r.name === role) ?? false;
    }, [user]);

    const hasPermission = useCallback((permission: string): boolean => {
        return user?.permissions.some(p => p.name === permission) ?? false;
    }, [user]);

    // Gunakan useMemo untuk mengoptimalkan value context
    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user, // Tambahkan helper flag
        login,
        relogin,
        logout,
        hasRole,
        hasPermission,
    }), [user, login, relogin, logout, hasRole, hasPermission]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}