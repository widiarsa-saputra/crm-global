// src/components/FacebookStyleChat/ChatboxContainer.tsx
import React from 'react';
import Chatbox from './Chatbox';

// Impor tipe data yang relevan untuk konsistensi
import { User as ChatUser, Message } from '@/shared/components/facebook-style-chat/types'; // Pastikan path ini benar sesuai dengan struktur proyek Anda

// Definisikan tipe untuk props komponen
interface ChatboxContainerProps {
    currentUser: ChatUser;
    openChats: string[]; // Ini adalah array berisi ID user yang chatnya terbuka
    messages: { [targetUserId: string]: Message[] };
    onSendMessage: (recipientUserId: string, messageText: string) => void;
    onCloseChat: (targetUserId: string) => void;
    onFocusChat: (targetUserId: string) => void;
    userMap: Map<string, string>; // <-- Terima "kamus penerjemah"
}

const ChatboxContainer: React.FC<ChatboxContainerProps> = ({
    currentUser,
    openChats,
    messages,
    onSendMessage,
    onCloseChat,
    onFocusChat,
    userMap // <-- Ambil kamus dari props
}) => {
    return (
        // Container ini mengatur posisi semua chatbox di pojok kanan bawah
        <div className="fixed bottom-0 right-4 sm:right-[100px] flex items-end gap-4 pointer-events-auto">
            {openChats.map(targetUserId => (
                <Chatbox
                    key={targetUserId} // Gunakan ID sebagai key, ini sangat penting dan stabil
                    currentUser={currentUser}
                    targetUserId={targetUserId} // Kirim ID user target
                    messages={messages[targetUserId] || []} // Ambil pesan berdasarkan ID target
                    onSendMessage={onSendMessage}
                    onClose={() => onCloseChat(targetUserId)}
                    onFocus={() => onFocusChat(targetUserId)}
                    userMap={userMap} // <-- Teruskan kamus penerjemah ke setiap Chatbox
                />
            ))}
        </div>
    );
};

export default ChatboxContainer;