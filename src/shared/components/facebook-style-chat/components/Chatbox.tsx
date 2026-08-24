// src/components/FacebookStyleChat/Chatbox.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Send, Check, CheckCheck } from 'lucide-react';

// Impor tipe data yang relevan dari lokasi pusat
import { User as ChatUser, Message } from '@/shared/components/facebook-style-chat/types'; // Pastikan path ini benar sesuai dengan struktur proyek Anda

// Definisikan tipe untuk props komponen
interface ChatboxProps {
    currentUser: ChatUser;
    targetUserId: string; // <-- Prop ini berisi ID user target
    messages: Message[];
    userMap: Map<string, string>; // <-- Terima "kamus penerjemah"
    onSendMessage: (recipientUserId: string, messageText: string) => void;
    onClose: () => void;
    onFocus: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({
    currentUser,
    targetUserId,
    messages,
    userMap,
    onSendMessage,
    onClose,
    onFocus
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [text, setText] = useState('');
    const feedRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // --- DIUBAH: Lakukan "penerjemahan" ID menjadi nama tampilan ---
    // Gunakan userMap untuk mencari nama berdasarkan ID.
    // Berikan fallback text jika ID tidak ditemukan di map (misalnya, user sudah tidak aktif).
    const targetDisplayName = userMap.get(targetUserId) || `User (${targetUserId.substring(0, 4)}...)`;

    // Efek untuk auto-scroll ke pesan terbaru
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [messages]);

    // Efek untuk fokus ke input saat chatbox dibuka/dimaksimalkan
    useEffect(() => {
        if (!isMinimized) {
            inputRef.current?.focus();
            onFocus(); // Panggil onFocus untuk menandai chat ini aktif
        }
    }, [isMinimized, onFocus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(targetUserId, text); // Kirim pesan ke targetUserId
            setText('');
        }
    };

    const handleHeaderClick = () => {
        setIsMinimized(!isMinimized);
        // Jika membuka dari kondisi minimize, panggil onFocus
        if (isMinimized) {
            onFocus();
        }
    };

    return (
        <div
            className={`w-80 bg-white rounded-t-lg shadow-2xl flex flex-col transition-all duration-300 ${isMinimized ? 'h-auto' : 'h-[450px]'}`}
            onClick={onFocus}
        >
            <div
                className="p-3 bg-blue-600 text-white rounded-t-lg flex justify-between items-center cursor-pointer"
                onClick={handleHeaderClick}
            >
                {/* Tampilkan NAMA HASIL TERJEMAHAN, bukan ID */}
                <h3 className="font-semibold truncate pr-2">{targetDisplayName}</h3>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleHeaderClick(); }} className="p-1 hover:bg-blue-700 rounded" aria-label="Minimize chat">
                        <Minus size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-blue-700 rounded" aria-label="Tutup chat">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className={`flex-grow flex flex-col min-h-0 ${isMinimized ? 'hidden' : 'flex'}`}>
                {/* Message Feed */}
                <div ref={feedRef} className="flex-grow p-3 overflow-y-auto">
                    <ul className="flex flex-col gap-1">
                        {messages.map((msg) => {
                            const isOutgoing = msg.user === currentUser.name; // msg.user adalah ID, currentUser.name juga ID
                            return (
                                <li key={msg.id} className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] p-2 rounded text-sm break-words ${isOutgoing ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {msg.message}
                                    </div>
                                    {isOutgoing && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                            {msg.is_read ? (
                                                <CheckCheck size={16} className="text-sky-400" />
                                            ) : (
                                                <Check size={16} />
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Message Input */}
                <form onSubmit={handleSubmit} className="p-2 border-t flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onFocus={onFocus}
                        placeholder="Ketik pesan..."
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button type="submit" disabled={!text.trim()} className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:bg-blue-300" aria-label="Kirim pesan">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbox;