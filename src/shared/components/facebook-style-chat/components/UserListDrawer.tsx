// src/components/FacebookStyleChat/UserListDrawer.tsx
import React from 'react';
import { X, User as UserIcon } from 'lucide-react';

// Impor tipe ChatUser yang telah kita definisikan untuk konsistensi
import { User as ChatUser } from '@/shared/components/facebook-style-chat/types';

// Tipe lokal untuk mendefinisikan bentuk objek user yang diterima di prop
interface RichOnlineUser {
    id: string;
    name: string; // Ini adalah nama asli untuk ditampilkan
}

// Definisikan tipe untuk props komponen
interface UserListDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: ChatUser;
    onlineUsers: RichOnlineUser[]; // <-- Terima data yang sudah diolah
    onUserSelect: (userId: string) => void; // Fungsi ini menerima ID user
}

const UserListDrawer: React.FC<UserListDrawerProps> = ({ isOpen, onClose, currentUser, onlineUsers, onUserSelect }) => {
    // Meskipun data sudah difilter di parent, ada baiknya tetap ada pengecekan di sini
    // untuk membuat komponen lebih mandiri (robust).
    const otherOnlineUsers = onlineUsers.filter(u => u.id !== currentUser.id);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/30 transition-opacity z-40 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Panel Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 pointer-events-auto flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-4 border-b flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">Pengguna Online</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 rounded" aria-label="Tutup">
                        <X size={24} />
                    </button>
                </div>
                <ul className="flex-grow overflow-y-auto">
                    {otherOnlineUsers.length > 0 ? (
                        otherOnlineUsers.map(onlineUser => (
                            <li key={onlineUser.id}>
                                <button
                                    onClick={() => onUserSelect(onlineUser.id)} // Kirim ID saat diklik
                                    className="w-full text-left p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="relative">
                                        <UserIcon className="h-8 w-8 text-gray-400" />
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded bg-green-500 ring-2 ring-white"></span>
                                    </div>
                                    {/* Tampilkan nama asli pengguna */}
                                    <span className="font-medium text-gray-700">{onlineUser.name}</span>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-gray-500 italic">
                            Tidak ada pengguna lain yang online.
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default UserListDrawer;