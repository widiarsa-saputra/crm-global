# Modul: Authentication & Otorisasi

**Fungsi Singkat**:
Menangani proses autentikasi (login, logout), verifikasi _token_, _state_ sesi pengguna global, serta pemblokiran akses menggunakan _middleware_ (_Forbidden_ atau _RequireAuth_).

**Mapping File Utama**:
- **Pages**: 
  - `src/auth/pages/LoginPage.tsx` (Halaman Login)
  - `src/auth/pages/ForbiddenPage.tsx` (Akses Ditolak)
- **Context/State**: 
  - `src/auth/context/AuthProvider.tsx` (Pusat state login/user aktif)
- **Middleware/Guards**: 
  - `src/auth/middleware/RequireAuth.tsx`
  - `src/auth/middleware/GuestOnly.tsx`
- **Router Configuration**: 
  - `src/router/AppRouter.tsx` (menangani deklarasi rute publik vs terproteksi menggunakan middleware di atas)

**Panduan Penambahan Fitur & Maintenance**:
- Jika ada perubahan format _token_ atau API autentikasi baru, modifikasi logika di dalam `AuthProvider.tsx`.
- Jika ingin menambah halaman statis yang *tidak* butuh login, bungkus rutenya dengan properti `guestOnly: true` di `AppRouter.tsx` yang nantinya menggunakan `GuestOnly.tsx`.
