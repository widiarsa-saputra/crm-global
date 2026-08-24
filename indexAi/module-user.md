# Dokumentasi Arsitektur Modul User, Roles, & Permissions

Modul ini bertanggung jawab atas akses akun, pembuatan user (untuk entitas seperti Admin, Tutor, Student), kontrol akses (RBAC - Role Based Access Control), dan sistem notifikasi/profiling.

## 1. Pemetaan: `features/user-management`
Direktori yang mengontrol administrasi data pengguna sistem secara umum.
- **`src/features/user-management/pages/`**: Komponen rendering untuk halaman utama pengguna.
- **`src/features/user-management/components/`**: UI tabel dan form.
  - Terdapat mekanisme di dalam modal `AddUserModal` yang mana input form akan secara otomatis mengenerate string "email" berdasarkan gabungan nama dan role pengguna, kemudian email tersebut ditampilkan sebagai readonly field.

## 2. Pemetaan: `features/role` & `features/permission`
- Mengelola data Role (contoh: "Admin", "Tutor", "Siswa").
- Mengelola matrik Permission untuk akses modul aplikasi.

---

## Pemetaan Services API (`src/services/`)

### 1. Users (`src/services/user/`)
- `schema/UserSchema.ts` (Zod validation untuk akun sistem)
- `response/UserResponse.ts`
- `hooks/useUserCRUD.ts`

### 2. Roles & Permissions (`src/services/role/`, `src/services/permission/`)
- `schema/RoleSchema.ts` / `PermissionSchema.ts`
- `response/RoleResponse.ts` / `PermissionResponse.ts`
- `hooks/useRoleCRUD.ts` / `usePermissionCRUD.ts`

---

## Aturan Maintenance (AI Guide)
1. **RegEx & Autogenerate Email**: Di modul User Management, ada logic parsing yang merubah string "Nama + Role" (huruf kecil, hilangkan spasi/karakter khusus, dan rubah menjadi `.` kemudian ditambah domain) untuk meng-generate email. Saat me-refactor form User, hati-hati jangan merusak state/trigger pembuatan string ini.
2. **Ketergantungan Akun**: Pembuatan akun User (`user_id`) sangat penting karena akan dilempar/direferensikan saat membuat entitas terkait seperti `Tutor` dan `Student`. Pastikan field ini selaras dan tervalidasi.
