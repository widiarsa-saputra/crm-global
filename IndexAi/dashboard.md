# Modul: Dashboard

**Fungsi Singkat**:
Halaman beranda (`/`) yang akan langsung dilihat oleh pengguna setelah berhasil masuk (_login_). Berfungsi sebagai pusat ringkasan metrik dan analitik awal.

**Mapping File Utama**:
- **Pages**: 
  - `src/features/dashboard/pages/DashboardPage.tsx`
- **Components**: 
  - `src/features/dashboard/components/` (Simpan komponen-komponen visual ringkasan khusus _dashboard_ di sini)
- **Services (API)**: 
  - Belum diaktifkan, jika di masa depan ada, letakkan di `src/services/dashboard/`

**Panduan Penambahan Fitur & Maintenance**:
- Untuk menghindari _code bloat_ di halaman Dashboard, pecah _chart_, tabel ringkasan, atau kartu metrik menjadi sub-komponen terpisah di dalam folder `components/` milik modul ini.
- Gunakan komponen _reusable_ standar (seperti _card_ bawaan dari folder `shared`) agar UI tetap konsisten.
