// src/components/FacebookStyleChat/FacebookStyleChat.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useChat } from '@/shared/components/facebook-style-chat/context/ChatContext'; // Pastikan path ini benar sesuai dengan struktur proyek Anda
import { useSocket } from '@/shared/components/facebook-style-chat/hooks/useSocket'; // Pastikan path ini benar sesuai dengan struktur proyek Anda
import { Message } from '@/shared/components/facebook-style-chat/types'; // Pastikan path ini benar sesuai dengan struktur proyek Anda
import ChatTrigger from './ChatTrigger';
import UserListDrawer from './UserListDrawer';
import ChatboxContainer from './ChatboxContainer';

// --- BARU: Import hook dan tipe dari data user aplikasi Anda ---
// Pastikan path ini benar sesuai dengan struktur proyek Anda
import useIndexUser from '@/services/user/hooks/useIndexUser';
import { SingleUserResponse } from '@/services/user/response/IndexUserResponse';

// URL konstanta
const NOTIFICATION_SOUND_URL = `${import.meta.env.VITE_BASE_APP_URL}/livechat/mixkit-positive-notification-951.mp3` || "https://livechat.gotrasoft.com/assets/sounds/notification.mp3";
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "https://livechat.gotrasoft.com/";

const FacebookStyleChat: React.FC = () => {
    // 'user' di sini adalah objek ChatUser dari context kita, dimana user.name berisi ID
    const { user } = useChat();

    // --- BARU: Panggil hook untuk mengambil semua user dari backend aplikasi ---
    const { data: allUsersData, isSuccess: isAllUsersSuccess } = useIndexUser({});

    // --- State untuk UI & Socket ---
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // State onlineUsers sekarang hanya berisi array ID, sesuai dari backend socket
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
    const [messages, setMessages] = useState<{ [target: string]: Message[] }>({});
    const [openChats, setOpenChats] = useState<string[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);

    // --- Refs untuk menstabilkan handler ---
    const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
    const openChatsRef = useRef(openChats);
    const activeChatRef = useRef(activeChat);

    useEffect(() => {
        openChatsRef.current = openChats;
    }, [openChats]);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    // --- BARU & KRUSIAL: Membuat "Kamus Penerjemah" (userMap) ---
    // userMap akan berisi: Map<userId: string, userName: string>
    const userMap = useMemo(() => {
        const map = new Map<string, string>();
        if (isAllUsersSuccess && allUsersData?.data) {
            allUsersData.data.forEach((appUser: SingleUserResponse) => {
                map.set(appUser.id, appUser.name); // Simpan -> '123': 'Komang'
            });
        }
        return map;
    }, [allUsersData, isAllUsersSuccess]);

    const playNotificationSound = useCallback(() => {
        notificationSoundRef.current?.play().catch(e => console.warn("Gagal memutar audio notifikasi:", e));
    }, []);

    const eventHandlers = useMemo(() => ({
        // --- DIUBAH: Handler ini sekarang menerima array ID (string) dari server socket ---
        'online users': (userIds: string[]) => {
            setOnlineUserIds(userIds);
        },
        'chat message': (data: Message) => {
            if (!user) return;
            const isOwnMessage = data.user === user.name; // user.name adalah ID
            const target = isOwnMessage ? data.recipient_username! : data.user;

            setMessages(prev => ({ ...prev, [target]: [...(prev[target] || []), data] }));

            if (!isOwnMessage) {
                if (!openChatsRef.current.includes(target)) {
                    setOpenChats(prevChats => [...prevChats, target].slice(-3));
                }
                if (target !== activeChatRef.current) {
                    playNotificationSound();
                }
            }
        },
        'private chat history': (data: { recipient: string; messages: Message[] }) => {
            setMessages(prev => ({ ...prev, [data.recipient]: data.messages.slice().reverse() }));
        },
        'message read confirmation': (data: { reader: string; target: string }) => {
            const chatPartnerId = data.reader;
            setMessages(prev => {
                const partnerMessages = prev[chatPartnerId];
                if (!partnerMessages) return prev;
                const newPartnerMessages = partnerMessages.map(msg =>
                    msg.user === user?.name && !msg.is_read ? { ...msg, is_read: true } : msg
                );
                return { ...prev, [chatPartnerId]: newPartnerMessages };
            });
        },
    }), [user, playNotificationSound]);

    const { emitEvent } = useSocket({
        url: SOCKET_SERVER_URL,
        user, // 'user' object ini dikirim ke useSocket, useSocket akan menggunakan user.name (ID) & user.companyId
        eventHandlers,
    });

    // --- BARU: Siapkan data yang kaya untuk UserListDrawer ---
    // Kita gabungkan data ID yang online dengan nama dari userMap
    const onlineUsersForDrawer = useMemo(() => {
        if (!userMap.size) return []; // Jangan render apapun jika map belum siap
        return onlineUserIds
            .map(id => ({
                id: id,
                name: userMap.get(id) || `User (${id.substring(0, 4)}...)` // Fallback jika user tidak ditemukan di map
            }))
            .filter(u => u.id !== user?.id) // Filter diri sendiri
            .sort((a, b) => a.name.localeCompare(b.name)); // Urutkan berdasarkan nama
    }, [onlineUserIds, userMap, user?.id]);


    // --- Fungsi Handler untuk Interaksi UI ---
    const markMessagesAsRead = useCallback((targetUserId: string) => {
        const targetMessages = messages[targetUserId] || [];
        const unreadMessageIds = targetMessages
            .filter(msg => msg.user === targetUserId && !msg.is_read)
            .map(msg => msg.id);

        if (unreadMessageIds.length > 0 && user) {
            emitEvent('mark messages as read', { reader: user.name, target: targetUserId }); // Kirim ID
            setMessages(prev => {
                const newTargetMessages = (prev[targetUserId] || []).map(msg =>
                    unreadMessageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
                );
                return { ...prev, [targetUserId]: newTargetMessages };
            });
        }
    }, [messages, user, emitEvent]);

    const handleOpenChat = useCallback((targetUserId: string) => {
        if (user && !openChats.includes(targetUserId)) {
            setOpenChats(prev => [...prev.filter(c => c !== targetUserId), targetUserId].slice(-3));
            emitEvent('request private chat history', {
                currentUser: user.name, // Kirim ID
                recipientUser: targetUserId
            });
        }
        setIsDrawerOpen(false);
        setActiveChat(targetUserId);
        markMessagesAsRead(targetUserId);
    }, [openChats, user, emitEvent, markMessagesAsRead]);

    const handleChatboxFocus = useCallback((targetUserId: string) => {
        setActiveChat(targetUserId);
        markMessagesAsRead(targetUserId);
    }, [markMessagesAsRead]);

    const handleCloseChat = useCallback((targetUserId: string) => {
        setOpenChats(prev => prev.filter(id => id !== targetUserId));
        if (activeChat === targetUserId) {
            setActiveChat(null);
        }
    }, [activeChat]);

    const handleSendMessage = useCallback((recipientUserId: string, messageText: string) => {
        if (!user || !messageText.trim()) return;
        emitEvent('private chat message', {
            recipientUser: recipientUserId,
            message: messageText,
        });
    }, [user, emitEvent]);


    // Jangan render apapun jika user dari context belum siap
    if (!user) {
        return null;
    }

    return (
        <>
            <audio ref={notificationSoundRef} src={NOTIFICATION_SOUND_URL} preload="auto"></audio>
            <div className="fixed inset-0 pointer-events-none z-40">
                <ChatTrigger onClick={() => setIsDrawerOpen(prev => !prev)} />
                <UserListDrawer
                    currentUser={user}
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onlineUsers={onlineUsersForDrawer}
                    onUserSelect={handleOpenChat}
                />
                <ChatboxContainer
                    currentUser={user}
                    openChats={openChats}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onCloseChat={handleCloseChat}
                    onFocusChat={handleChatboxFocus}
                    userMap={userMap}
                />
            </div>
        </>
    );
};

export default FacebookStyleChat;