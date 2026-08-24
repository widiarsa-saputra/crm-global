// src/types.ts

// Mendefinisikan status koneksi yang mungkin untuk kejelasan kode
export type ConnectionStatus =
    | 'IDLE'          // Belum terhubung
    | 'CONNECTING'
    | 'CONNECTED'
    | 'RECONNECTING'
    | 'DISCONNECTED'
    | 'ERROR';

// Mendefinisikan struktur data untuk satu item log
export interface LogItem {
    id: string;         // ID unik dari data
    timestamp: string;  // Timestamp dalam format ISO string
    type: string;       // Tipe event, misal: 'user_login'
    room_id: string;    // Room tempat data ini berada
    payload: any;       // Isi data sebenarnya
    isHistory?: boolean; // Flag untuk menandai apakah ini dari riwayat
}