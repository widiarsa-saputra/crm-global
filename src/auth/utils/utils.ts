// src/auth/utils/utils.ts

import { Permission, Role } from "../response/loginResponseSchema";

// 1. Definisikan tipe untuk aturan redirect agar lebih jelas
type RedirectRule = {
    path: string;
    // Aturan bisa berdasarkan role, permission, atau keduanya
    role?: string;
    permission?: string;
    // Tambahkan prioritas: angka lebih tinggi akan dicek lebih dulu
    priority: number;
};

// 2. Buat konfigurasi aturan di satu tempat. Mudah dibaca dan diubah.
const redirectRules: RedirectRule[] = [
    // Admin & Dev juga ke dashboard admin
    { path: '/', role: 'superadmin', priority: 100 },
    { path: '/', role: 'admin', priority: 90 },
    { path: '/', role: 'dev', priority: 80 },

    // Contoh: Manajer keuangan ke halaman finance
    { path: '/finance', role: 'finance-manager', priority: 50 },
    { path: '/finance', permission: 'view_finance', priority: 49 },

    // Contoh: Manajer laporan ke halaman report
    { path: '/report', permission: 'view_report', priority: 40 },

    // Contoh: Semua user yang bisa melihat dashboard utama
    { path: '/', permission: 'dashboard_view', priority: 10 },
];

// 3. Buat fungsi yang lebih cerdas untuk mengevaluasi aturan ini
export const getRedirectPath = (roles: Role[], permissions: Permission[]): string => {
    // Buat Set untuk pencarian yang lebih cepat (O(1) average time complexity)
    const userRoles = new Set(roles.map(r => r.name));
    const userPermissions = new Set(permissions.map(p => p.name));

    // Urutkan aturan berdasarkan prioritas, dari tertinggi ke terendah
    const sortedRules = [...redirectRules].sort((a, b) => b.priority - a.priority);

    // Cari aturan pertama yang cocok dengan role atau permission user
    for (const rule of sortedRules) {
        const hasRequiredRole = rule.role && userRoles.has(rule.role);
        const hasRequiredPermission = rule.permission && userPermissions.has(rule.permission);

        // Jika aturan terpenuhi (baik oleh role atau permission), kembalikan path-nya
        if (hasRequiredRole || hasRequiredPermission) {
            return rule.path;
        }
    }

    // Jika tidak ada aturan yang cocok (misal user umum tanpa role khusus), arahkan ke home
    return '/'; 
};