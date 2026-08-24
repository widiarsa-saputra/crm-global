# Index AI - Project Mapping

Direktori ini (`indexAi/`) berfungsi sebagai peta konteks dan dokumentasi arsitektur modul untuk membantu AI mengerti pola, memelihara (maintenance), serta menambahkan fitur pada proyek **Bimbel Admin Portal** dengan cepat dan konsisten.

## Daftar Modul

Berikut adalah pemetaan modul-modul utama dalam sistem. AI diharapkan membaca penjelasan modul terkait sebelum melakukan perubahan kode pada bagian tersebut.

| Modul | Keterangan | Tautan Dokumentasi |
| --- | --- | --- |
| **Global Rules** | Aturan umum penulisan kode, penamaan direktori, dan aturan modifikasi di Vite + React proyek ini. | [project-context.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/project-context.md) |
| **Student** | Modul pengelolaan siswa (Tabel, Form Tambah, Update, Hapus) menggunakan pola form terpisah dan useBaseCRUD hook. | [module-student.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/module-student.md) |
| **Tutor** | Modul pengelolaan tutor, beradaptasi dengan pola arsitektur dari modul Student. | [module-tutor.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/module-tutor.md) |
| **Courses & Sections** | Modul yang membawahi data kursus (Courses), kategori kursus (Course Categories), dan bab materi (Course Sections). | [module-courses.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/module-courses.md) |
| **Classes** | Modul pengelolaan Kelas. Menggabungkan Siswa, Tutor, dan Jadwal (Schedule). | [module-classes.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/module-classes.md) |
| **User & Roles** | Modul manajemen pengguna, hak akses (permissions), dan otentikasi. Termasuk di dalamnya pembuatan otomatis alamat email dari nama. | [module-user.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/module-user.md) |

## Struktur Utama Proyek

### 1. `src/features/` (UI & Components)
Merupakan direktori presentasional dan interaksi pengguna. Setiap folder di dalamnya (misal: `student/`, `tutor/`, `courses/`) biasanya mengandung sub-folder:
- `/pages` - Komponen top-level untuk route (misal: `StudentPage.tsx`).
- `/components` - Komponen logika modul seperti Table, Form (Tambah, Edit, Hapus) dan Modal.

### 2. `src/services/` (API & Hooks)
Merupakan lapisan komunikasi data dengan backend, menggunakan standar Zod (schema) dan React Query (hooks).
- `/schema` - Definisi tipe data dan payload API menggunakan Zod.
- `/response` - Format standarisasi respon API.
- `/hooks` - Custom hooks (biasanya `use[Modul]CRUD.ts`) yang membungkus pemanggilan fetch API standar (Index, Show, Create, Update, Delete) yang diwarisi dari `src/services/base/`.

### 3. `src/shared/` & `src/components/` (Core & Shared)
Komponen yang dipakai secara global dan berulang di berbagai halaman/modul, seperti `Button`, `Modal`, `AlertDialog`, topbar config.

---

**Panduan untuk AI:**
1. **Analisis**: Jika diminta merubah modul tertentu, selalu mulai dengan melihat `module-[nama].md` terkait (misal: [module-student.md](file:///home/widiarsa16/Projects/bimbel-admin-portal/indexAi/module-student.md) sebagai blueprint pola).
2. **Pola CRUD**: Seluruh modul operasional memisahkan validasi (`Zod`), panggilan server (`React Query`), dan UI (`Modal` state control).
3. **Pencarian File**: Folder `features/` dan `services/` dipecah simetris. Jika ada fitur di `features/tutor/`, pasti ada services-nya di `services/tutors/`.
