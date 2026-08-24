# Modul: File Manager

**Fungsi Singkat**:
Sistem manajemen file (mirip _Google Drive_ sederhana) di mana admin dapat melihat, mengunggah, mengunduh, serta mengorganisir dokumen dan media (gambar, video, PDF) secara hierarkis maupun datar.

**Mapping File Utama**:
- **Pages**: 
  - `src/features/file-manager/pages/FileManagerPage.tsx`
- **Components**: 
  - `src/features/file-manager/components/` (berisi komponen UI seperti tabel file, modal _upload_, tampilan _grid_ folder, dll)
- **Services (API)**: 
  - `src/services/file/` (endpoint terkait operasi _upload_, hapus, _list_ file)

**Panduan Penambahan Fitur & Maintenance**:
- Fungsi _upload_ file harus selalu dikelola oleh layanan (API call) tersentralisasi di `src/services/file/` agar standardisasi _header_ form-data konsisten dengan kebutuhan sistem.
- Hindari menyebarkan logika unggah gambar secara sporadis di modul lain jika bisa memanfaatkan layanan *file-manager* ini.
