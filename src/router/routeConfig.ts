import React, { ElementType } from "react";
import { Folder, Lock, ShieldCheck, UserCircle, Users } from "lucide-react";

export interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
    roles?: string[];
    permissions?: string[];
}

export interface MenuSection {
    order?: number;
    id?: string;
    label: string;
    icon: React.ElementType;
    items: MenuItem[];
    customContent?: React.ReactNode;
}

export const ROUTES = {
    SLASH: { path: "/" },
    CONTACTS: { path: "/contacts" },
    CAMPAIGNS: { path: "/campaigns" },
    CAMPAIGN_CONTACTS: { path: "/campaign-contacts" },
    TEMPLATES: { path: "/templates" },
    USER_MANAGEMENT: { path: "/manajemen-pengguna" },
    PERMISSIONS: { path: "/izin" },
    ROLES: { path: "/peran" },
    ROLES_USERS_ASSIGNED: { path: "/peran/:roleId/pengguna" },
    ROLES_PERMISSIONS_ASSIGNED: { path: "/peran/:roleId/izin" },
    PROFILE: { path: "/profil" },
    CHANGE_PASSWORD: { path: "/profil/ganti-kata-sandi" },
    NOTIFICATIONS: { path: "/notifikasi" },
    FILE_MANAGER: { path: "/manajer-berkas" },
    LOGIN: { path: "/authentication" },
    FORBIDDEN: { path: "/terlarang" },
    NOT_FOUND: { path: "*" },
} as const;

export const userSections: MenuSection[] = [
    {
        label: "Akun Anda",
        icon: Users as ElementType,
        items: [
            {
                text: "Profil",
                url: ROUTES.PROFILE.path,
                icon: UserCircle,
                permissions: ["view_profile"],
            },
        ],
    },
    {
        label: "Manajemen Sistem",
        icon: Folder as ElementType,
        items: [
            {
                text: "Manajer Berkas",
                url: ROUTES.FILE_MANAGER.path,
                icon: Folder,
                permissions: ["view_file_manager"],
            },
            {
                text: "Manajemen Pengguna",
                url: ROUTES.USER_MANAGEMENT.path,
                icon: Users,
                permissions: ["view_user_management"],
            },
            {
                text: "Manajemen Peran",
                url: ROUTES.ROLES.path,
                icon: ShieldCheck,
                permissions: ["view_role_management"],
            },
            {
                text: "Manajemen Izin",
                url: ROUTES.PERMISSIONS.path,
                icon: Lock,
                permissions: ["view_permission_management"],
            },
        ],
    },
];
