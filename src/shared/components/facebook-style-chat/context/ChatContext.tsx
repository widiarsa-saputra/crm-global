// src/context/ChatContext.tsx
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { User as ChatUser } from '../types'; // Kita beri alias agar tidak bentrok dengan tipe User dari useAuth

// 1. Import hook otentikasi Anda. GANTI PATH INI sesuai dengan struktur proyek Anda.
import { useAuth } from '@/auth/context/AuthProvider' // CONTOH: Ganti dengan path yang benar
import { LoginData } from '@/auth/response/loginResponseSchema';

// 2. Sederhanakan tipe context. Sekarang hanya menyediakan user.
interface ChatContextType {
    user: ChatUser | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    // 3. Panggil useAuth untuk mendapatkan data user yang sedang login
    const { user: authUser } = useAuth() as { user: LoginData | null }; // Ambil user dari AuthContext

    // 4. Lakukan mapping dari user otentikasi ke format User yang dibutuhkan Chat
    //    Gunakan useMemo agar mapping ini hanya berjalan saat authUser berubah.
    const chatUser: ChatUser | null = useMemo(() => {
        // Jika user dari useAuth ada, kita buat objek user untuk chat
        if (authUser) {
            return {
                ...authUser, // Ambil semua properti dari authUser
                // SESUAIKAN PROPERTI INI dengan objek user dari useAuth() Anda
                id: authUser.id,          // Misal: Anda menggunakan authUser.id
                displayName: authUser.name, // Misal: Anda menggunakan authUser.name
                name: authUser.id,      // Misal: Anda menggunakan authUser.username
                companyId: 'base', // Misal: Anda menggunakan authUser.companyId
            };
        }
        // Jika tidak ada user yang login, kembalikan null
        return null;
    }, [authUser]);

    // 5. Sediakan user yang sudah dimapping ke dalam context.
    //    Tidak ada lagi fungsi login/logout di sini.
    const value = { user: chatUser };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};