// src/auth/services/authService.ts

import { LoginData } from '../response/loginResponseSchema';

// Definisikan tipe untuk storage agar bisa diganti (misal: sessionStorage atau in-memory)
interface AuthStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

// Implementasi default menggunakan localStorage
const defaultStorage: AuthStorage = {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
};

class AuthService {
    private storage: AuthStorage;
    private userKey = 'user';
    private tokenKey = 'authToken';

    constructor(storage: AuthStorage = defaultStorage) {
        this.storage = storage;
    }

    // --- Token Management ---
    getToken(): string | null {
        return this.storage.getItem(this.tokenKey);
    }

    setToken(token: string): void {
        this.storage.setItem(this.tokenKey, token);
    }

    // --- User Data Management ---
    getUser(): LoginData | null {
        const storedUser = this.storage.getItem(this.userKey);
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Failed to parse user data from storage", e);
            this.clearSession();
            return null;
        }
    }

    setUser(userData: LoginData): void {
        this.storage.setItem(this.userKey, JSON.stringify(userData));
    }

    // --- Session Management ---
    startSession(userData: LoginData, token: string): void {
        this.setUser(userData);
        this.setToken(token);
    }

    updateSession(userData?: LoginData, token?: string): void {
        if (userData) {
            this.setUser(userData);
        }
        if (token) {
            this.setToken(token);
        }
    }

    clearSession(): void {
        this.storage.removeItem(this.userKey);
        this.storage.removeItem(this.tokenKey);
    }
}

// Export sebagai singleton instance
export const authService = new AuthService();