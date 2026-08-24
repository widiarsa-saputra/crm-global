// src/components/ConnectionPanel.tsx
import { useState, useEffect } from 'react';
import { ConnectionStatus } from '../types';

interface ConnectionPanelProps {
    status: ConnectionStatus;
    currentRoom: string | null;
    onConnect: (roomId: string) => void;
    onDisconnect: () => void;
}

// Fungsi untuk menerjemahkan status internal ke teks yang ramah pengguna
const getStatusText = (status: ConnectionStatus): { text: string; color: string } => {
    switch (status) {
        case 'IDLE': return { text: 'Belum Terhubung', color: 'text-gray-600' };
        case 'CONNECTING': return { text: 'Menghubungkan...', color: 'text-yellow-600' };
        case 'CONNECTED': return { text: 'Terhubung', color: 'text-green-600' };
        case 'RECONNECTING': return { text: 'Mencoba Koneksi Ulang...', color: 'text-yellow-600' };
        case 'DISCONNECTED': return { text: 'Terputus', color: 'text-red-600' };
        case 'ERROR': return { text: 'Gagal Terhubung', color: 'text-red-600' };
        default: return { text: 'Unknown', color: 'text-gray-600' };
    }
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ status, currentRoom, onConnect, onDisconnect }) => {
    const [roomIdInput, setRoomIdInput] = useState<string>('');
    const isConnected = !!currentRoom;
    const statusInfo = getStatusText(status);

    // Efek untuk memuat room ID terakhir dari localStorage saat pertama kali render
    useEffect(() => {
        const lastRoomId = localStorage.getItem('realtime_last_room_id');
        if (lastRoomId) {
            setRoomIdInput(lastRoomId);
        }
    }, []);

    const handleConnectClick = () => {
        if (roomIdInput.trim()) {
            localStorage.setItem('realtime_last_room_id', roomIdInput.trim());
            onConnect(roomIdInput.trim());
        } else {
            alert('Room ID tidak boleh kosong!');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isConnected) {
            handleConnectClick();
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded shadow-xl mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">Terminal Data Realtime</h1>
            <div className="mb-6">
                <label htmlFor="room-id-input" className="block mb-2 text-sm font-medium text-gray-700">Masukkan Room ID:</label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        id="room-id-input"
                        placeholder="Contoh: app_notifikasi"
                        value={roomIdInput}
                        onChange={(e) => setRoomIdInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isConnected}
                        className="flex-grow p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100"
                    />
                    {!isConnected && (
                        <button onClick={handleConnectClick} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded transition duration-150 text-sm">
                            Gabung Room
                        </button>
                    )}
                </div>
                {isConnected && (
                    <button onClick={onDisconnect} className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded transition duration-150 text-sm">
                        Keluar Room & Ganti
                    </button>
                )}
            </div>
            <div className="mb-4 text-sm">
                <p>Status Koneksi: <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span></p>
                <p>Room Aktif: <span className="font-semibold text-blue-600">{currentRoom || '-'}</span></p>
            </div>
        </div>
    );
};

export default ConnectionPanel;