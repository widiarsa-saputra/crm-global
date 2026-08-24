import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios'; // <-- Import axios

// Perbarui tipe data notifikasi untuk menyertakan status 'isRead'
export interface NotificationItem {
    id: string;
    timestamp: string;
    type: string;
    room_id: string;
    payload: any;
    isRead?: boolean; // <-- Tambahkan properti ini
}

// Perbarui tipe context
interface NotificationContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    clearUnreadBadge: () => void; // Ganti nama agar lebih jelas
    markNotificationAsRead: (notificationId: string) => void; // <-- Tambahkan fungsi baru
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

const SOCKET_SERVER_URL = "https://realtime-data.gotrasoft.com"; // URL tanpa trailing slash
const NOTIFICATION_ROOM_ID = "my_test_room";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        const socket: Socket = io(SOCKET_SERVER_URL);

        socket.on('connect', () => {
            console.log('[NOTIF_SOCKET] Terhubung, bergabung ke room:', NOTIFICATION_ROOM_ID);
            socket.emit('join_room', { room_id: NOTIFICATION_ROOM_ID });
        });

        socket.on('data_history', (response: { history: NotificationItem[] }) => {
            console.log('[NOTIF_SOCKET] Menerima riwayat notifikasi:', response.history);
            // Asumsikan semua riwayat sudah dibaca
            const historyItems = response.history.map(item => ({ ...item, isRead: true }));
            setNotifications(historyItems.slice().reverse());
        });

        socket.on('new_data', (data: NotificationItem) => {
            console.log('[NOTIF_SOCKET] Notifikasi baru diterima:', data);
            // Tandai notifikasi baru sebagai belum dibaca
            setNotifications(prev => [{ ...data, isRead: false }, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            console.log('[NOTIF_SOCKET] Membersihkan koneksi socket notifikasi.');
            socket.disconnect();
        };
    }, []);

    // Fungsi untuk mereset HANYA badge angka, dipanggil saat dropdown dibuka
    const clearUnreadBadge = useCallback(() => {
        setUnreadCount(0);
    }, []);

    // Fungsi untuk menandai satu notifikasi sebagai telah dibaca
    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        // 1. Update UI secara optimis untuk responsivitas instan
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, isRead: true } : notif
            )
        );

        // 2. Panggil API di latar belakang
        try {
            console.log(`[API] Mengirim 'acknowledge' untuk event_id: ${notificationId}`);
            await axios.post(`${SOCKET_SERVER_URL}/api/acknowledge`, {
                event_id: notificationId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`[API] Berhasil 'acknowledge' untuk event_id: ${notificationId}`);
        } catch (error) {
            console.error("Gagal menandai notifikasi sebagai terbaca di server:", error);
            // Opsional: Kembalikan state jika API gagal (rollback)
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, isRead: false } : notif
                )
            );
        }
    }, []);

    const value = { notifications, unreadCount, clearUnreadBadge, markNotificationAsRead };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};