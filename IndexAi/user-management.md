# Modul: User Management

**Fungsi Singkat**:
Melakukan tugas *Create, Read, Update, Delete* (CRUD) untuk daftar pengguna (User) atau staf di dalam sistem aplikasi CRM ini.

**Mapping File Utama**:
- **Pages**: 
  - `src/features/user-management/pages/UserManagementPage.tsx`
- **Components**: 
  - `src/features/user-management/components/` (berisi tabel pengguna, form tambah pengguna, dsb)
- **Services (API)**: 
  - `src/services/user/` (layanan utama untuk entitas *User*)
  - `src/services/user-role/` (layanan perantara untuk memberikan otorisasi ke _User_ tertentu)

**Panduan Penambahan Fitur & Maintenance**:
- Semua komponen modal (misalnya `UserModal`) dan tabel harus memanggil fungsi-fungsi mutasi melalui pustaka `react-query` dengan mengambil API dari folder `services/user`.
- Ketika menghapus _User_, pastikan tidak hanya API yang dipanggil, melainkan juga _query keys_ terkait turut di-_invalidate_.
