# Modul: Notification

**Fungsi Singkat**:
Sistem *in-app notifications* untuk menginfokan event penting kepada *User* secara *real-time* atau kronologis.

**Mapping File Utama**:
- **Pages**: 
  - `src/features/notification/pages/AllNotificationPage.tsx` (Halaman daftar notifikasi lengkap)
- **Components**: 
  - `src/features/notification/components/`
- **Context/State**: 
  - `src/shared/components/notification/context/NotificationContext.tsx`
- **Services (API)**: 
  - `src/services/notification-service/`

**Panduan Penambahan Fitur & Maintenance**:
- State (_unread count_, dsb.) dijaga melalui `NotificationContext` di folder `shared` agar notifikasi di bagian navigasi (_Topbar_) selalu selaras.
- Apabila ingin menambah kapabilitas *WebSocket* / *Polling*, logic koneksi tersebut sebaiknya difokuskan pada _Provider_ tersebut.
