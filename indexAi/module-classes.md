# Dokumentasi Arsitektur Modul Classes (Kelas Bimbel)

Modul Kelas (`classes`) merupakan core/jantung dari aplikasi ini. Entitas "Kelas" akan mengikat berbagai aspek: Siapa tutornya, siapa siswanya, dan apa materi yang diajarkan.

## Pemetaan: `features/classes`
Direktori ini mengandung tampilan dan antarmuka untuk operasional kelas.
- **`src/features/classes/pages/`**: Komponen untuk halaman root (ClassPage) atau detail (ClassDetailPage).
- **`src/features/classes/components/`**: Berisi UI utama seperti:
  - `ClassMainContent.tsx`: Tabel list kelas
  - `AddClass.tsx`, `UpdateClass.tsx`, `RemoveClass.tsx`: Modal popups untuk aksi pada list kelas.
  - `ClassMutationForm.tsx`: Komponen UI Form dengan hooks (React Hook Form).

## Pemetaan Services API (`src/services/classes/`)
- **`schema/ClassSchema.ts`**: Schema Zod yang mendefinisikan validasi untuk list kelas dan input form kelas.
- **`response/ClassResponse.ts`**: Definisi antarmuka API response mapping untuk list, detail, create, dan update.
- **`hooks/useClassCRUD.ts`**: Set hook (berasal dari hook dasar API di `base/`) untuk mengeksekusi operasi (GET, POST, PUT, DELETE) terkait entitas kelas.

---

## Aturan Maintenance Khusus Modul Class
1. **Kompleksitas Form**: Saat memodifikasi form Kelas (di `ClassMutationForm.tsx`), ingat bahwa input relasi (misal tutor_id, course_id) menggunakan library form combo box atau select yang mungkin melisting data eksternal (ambil dari hook service tutor/course).
2. **Side Effect**: Perubahan pada schema `ClassSchema.ts` mungkin akan berdampak pada jadwal (schedule) atau absensi karena dependensi relasional data. Selalu periksa impact-nya di fitur lain.
