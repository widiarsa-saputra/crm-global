// src/hooks/useSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { User } from '../types';

type EventHandler = (...args: any[]) => void;
interface EventHandlers {
    [event: string]: EventHandler;
}

interface UseSocketProps {
    url: string;
    user: User | null;
    eventHandlers: EventHandlers;
}

export const useSocket = ({ url, user, eventHandlers }: UseSocketProps) => {
    const socketRef = useRef<Socket | null>(null);

    const emitEvent = useCallback((event: string, payload: any) => {
        socketRef.current?.emit(event, payload);
    }, []);

    useEffect(() => {
        if (!user) {
            if (socketRef.current?.connected) {
                socketRef.current.disconnect();
            }
            return;
        }

        if (socketRef.current) return;

        const socket = io(url, {
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[useSocket] Terhubung dengan ID:', socket.id);
            emitEvent('set user and room', { user: user.name, room: user.companyId });
        });

        socket.on('disconnect', (reason) => {
            console.log('[useSocket] Terputus:', reason);
        });

        Object.entries(eventHandlers).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        return () => {
            console.log('[useSocket] Membersihkan...');
            Object.keys(eventHandlers).forEach((event) => {
                socket.off(event);
            });
            socket.disconnect();
            socketRef.current = null;
        };
    }, [url, user, eventHandlers, emitEvent]);

    return { emitEvent };
};