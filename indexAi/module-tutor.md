# Dokumentasi Arsitektur Modul Tutor (UI dan Services)

Panduan arsitektur komponen dan abstraksi service untuk fitur `tutor`. Modul ini sangat mirip dengan modul `student` dalam penggunaan pola CRUD.

## Pemetaan Lengkap: `features/tutor`

### 1. Page Component
- **`src/features/tutor/pages/TutorPage.tsx`**: Komponen **top-level page** yang dirender oleh router untuk menampilkan konten Tutor.
- **`src/features/tutor/pages/index.ts`**: Entry point untuk mempermudah impor ke router.

### 2. Main Content & Listing
- **`src/features/tutor/components/TutorMainContent.tsx`**: Komponen sentral yang mengatur tampilan tabel, pencarian, pagination, dan mengelola state untuk membuka dialog edit/hapus.

### 3. Modals & Forms
- **`src/features/tutor/components/AddTutor.tsx`**: Dialog modal untuk menambah tutor baru. Mengelola state `open` secara independen.
- **`src/features/tutor/components/UpdateTutor.tsx`**: Dialog modal untuk mengedit tutor yang ada. State `open` dan datanya dikontrol dari parent (`TutorMainContent`).
- **`src/features/tutor/components/RemoveTutor.tsx`**: Dialog konfirmasi hapus tutor menggunakan `AlertDialog`.
- **`src/features/tutor/components/TutorMutationForm.tsx`**: Form reusable (Zod + React Hook Form) yang dipakai di dalam `AddTutor` maupun `UpdateTutor`.

---

## Pemetaan Lengkap: `services/tutors`

### 1. Schema & Types
- **`src/services/tutors/schema/TutorSchema.ts`**: Berisi validasi Zod untuk response API (TutorIndexSchema) dan form payload (TutorCreateSchema, TutorUpdatePayload).

### 2. Response Types
- **`src/services/tutors/response/TutorResponse.ts`**: Standarisasi format response dari base response.

### 3. Hooks API (React Query)
- **`src/services/tutors/hooks/useTutorCRUD.ts`**:
  - `useTutorIndex()` — Untuk daftar tabel
  - `useTutorShow(id)` — Untuk detail tutor
  - `useTutorCreate()` — Untuk form add
  - `useTutorUpdate()` — Untuk form edit
  - `useTutorDelete()` — Untuk hapus

---

## Aturan dan Maintenance
Jika perlu merubah form input pada tutor:
1. Update validasi terlebih dahulu di `TutorSchema.ts`.
2. Jika ada field baru, tambahkan elemen input di dalam `TutorMutationForm.tsx`.
3. Pastikan inisialisasi reset value ditambahkan pada `useEffect` di `AddTutor.tsx` dan `UpdateTutor.tsx`.
