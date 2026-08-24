# Dokumentasi Arsitektur Modul Courses (Kursus & Materi)

Modul ini bertanggung jawab atas tiga entitas utama yang saling berelasi hirarkis: **Course Categories**, **Courses**, dan **Course Sections**. 

## Pemetaan: `features/courses`
Menangani master data Kursus (contoh: "Matematika SD", "Fisika SMA").
- **`src/features/courses/pages/`**: Komponen halaman root.
- **`src/features/courses/components/CourseMainContent.tsx`**: Menampilkan list courses.
- **`src/features/courses/components/AddCourse.tsx`**, **`UpdateCourse.tsx`**, **`RemoveCourse.tsx`**: Dialog CRUD.
- **`src/features/courses/components/CourseMutationForm.tsx`**: Form input.

## Pemetaan: `features/course-categories`
Kategori grup untuk course (contoh: "SD", "SMP", "SMA").
- **`src/features/course-categories/pages/`**: Komponen halaman kategori.
- **`src/features/course-categories/components/`**: Berisi UI Table dan Form Modal untuk menambah, mengedit (UpdateCourseCategory), dan menghapus kategori.

## Pemetaan: `features/course-sections`
Bab / Section untuk suatu Course tertentu (contoh: "Bab 1: Aljabar", "Bab 2: Geometri"). Relasi `course_id` (foreign key) berada di tabel ini.
- **`src/features/course-sections/pages/`**: Komponen halaman section.
- **`src/features/course-sections/components/`**: Berisi list dan form untuk mengelola bagian dari kursus.

---

## Pemetaan Services API (`src/services/`)

Semua hook API, schema zod, dan format response terpisah di dalam folder layanan masing-masing.

### 1. Courses (`src/services/courses/`)
- `schema/CourseSchema.ts` (Zod validation)
- `response/CourseResponse.ts`
- `hooks/useCourseCRUD.ts` (List, Show, Create, Update, Delete)

### 2. Course Categories (`src/services/course-categories/`)
- `schema/CourseCategorySchema.ts`
- `response/CourseCategoryResponse.ts`
- `hooks/useCourseCategoryCRUD.ts`

### 3. Course Sections (`src/services/course-sections/`)
- `schema/CourseSectionSchema.ts`
- `response/CourseSectionResponse.ts`
- `hooks/useCourseSectionCRUD.ts`

---

## Aturan Maintenance (AI Guide)
1. **Dropdown / Select Relasi**: Jika menambahkan form di `Courses`, pastikan API untuk menarik list data `Course Categories` telah dipanggil menggunakan query hook dari services (contoh: `useCourseCategoryIndex`).
2. **Validasi Schema Terpisah**: Walaupun ini 3 entitas saling terkait, skemanya dan end-point API-nya terpisah. Update `Zod Schema` yang benar di foldernya masing-masing sebelum update UI.
