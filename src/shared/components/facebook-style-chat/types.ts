// src/types.ts
export interface User {
    id: string;          // ID unik asli dari useAuth
    name: string;        // Properti yang dikirim ke socket (akan kita isi dengan ID)
    displayName: string; // Nama asli untuk ditampilkan di UI
    companyId: string;
}

export interface Message {
    id: string;
    user: string;
    message: string;
    timestamp: string;
    type: 'public' | 'private' | 'notification';
    is_read?: boolean;
    replied_to_message_id?: string;
    replied_to_message_user?: string;
    replied_to_message_text?: string;
    recipient_username?: string;
}

export interface UnreadCounts {
    [target: string]: number;
}