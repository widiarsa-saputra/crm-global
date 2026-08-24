import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { LogItem, ConnectionStatus } from '../types';
import ConnectionPanel from '../components/ConnectionPanel';
import LogPanel from '../components/LogPanel';

const SOCKET_SERVER_URL = "https://realtime-data.gotrasoft.com/";

const NotificationPage = () => {
    const [status, setStatus] = useState<ConnectionStatus>('IDLE');
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [logEntries, setLogEntries] = useState<LogItem[]>([]);
    const socketRef = useRef<Socket | null>(null);

    // Efek ini menangani seluruh siklus hidup koneksi socket
    useEffect(() => {
        // Jangan lakukan apa-apa jika tidak ada room yang di-set untuk dihubungkan
        if (!currentRoom) {
            return;
        }

        setStatus('CONNECTING');
        // Buat koneksi socket baru
        const socket = io(SOCKET_SERVER_URL, {
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });
        socketRef.current = socket;

        // --- Event Listeners ---
        socket.on('connect', () => {
            setStatus('CONNECTED');
            console.log('[SOCKET] Terhubung dengan ID:', socket.id);
            socket.emit('join_room', { room_id: currentRoom });
        });

        socket.on('room_joined', (response: { success: boolean, room_id: string }) => {
            if (response.success) {
                console.log(`[SOCKET] Berhasil bergabung room: ${response.room_id}`);
                // Minta riwayat setelah berhasil bergabung
                socket.emit('request_history', { room_id: response.room_id, limit: 50 });
            }
        });

        socket.on('new_data', (data: LogItem) => {
            console.log('[SOCKET] Menerima new_data:', data);
            // Tambahkan data baru ke paling atas array
            setLogEntries(prev => [data, ...prev]);
        });

        socket.on('data_history', (response: { history: LogItem[] }) => {
            console.log('[SOCKET] Menerima data_history:', response.history);
            // Tandai item sebagai histori dan tambahkan ke paling atas
            const historyItems = response.history.map(item => ({ ...item, isHistory: true }));
            setLogEntries(prev => [...historyItems.reverse(), ...prev]);
        });

        // Listener untuk status koneksi lainnya
        socket.on('disconnect', () => setStatus('DISCONNECTED'));
        socket.on('connect_error', () => setStatus('ERROR'));
        socket.on('reconnect_attempt', () => setStatus('RECONNECTING'));

        // --- Fungsi Cleanup ---
        // Ini akan berjalan saat komponen unmount atau saat `currentRoom` berubah
        return () => {
            console.log('[CLEANUP] Memutuskan koneksi dan membersihkan listeners.');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [currentRoom]); // Efek ini hanya berjalan kembali saat `currentRoom` berubah

    const handleConnect = (roomId: string) => {
        if (roomId) {
            setLogEntries([]); // Bersihkan log lama
            setCurrentRoom(roomId); // Ini akan memicu useEffect di atas
        }
    };

    const handleDisconnect = () => {
        if (socketRef.current) {
            socketRef.current.emit('leave_room', { room_id: currentRoom });
            socketRef.current.disconnect();
        }
        setCurrentRoom(null);
        setStatus('IDLE');
        setLogEntries([]);
    };

    const handleClearLog = () => {
        setLogEntries([]);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-[100dvh] p-4 sm:p-6 w-full">
            <ConnectionPanel
                status={status}
                currentRoom={currentRoom}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
            />
            <LogPanel
                logEntries={logEntries}
                onClearLog={handleClearLog}
            />
        </div>
    );
}

export default NotificationPage