# Dokumentasi Arsitektur Modul Student (UI dan Services)

Panduan lengkap arsitektur komponen dan abstraksi service untuk fitur `student`. Dokumen ini adalah **source of truth** untuk pola yang direplikasi ke modul lain (contoh: `tutor`).

---

# Pemetaan Lengkap: `features/student`

---

## 1. `StudentPage` (pages/StudentPage.tsx)

Komponen **top-level page** yang dirender oleh router. Hanya membungkus `StudentMainContent` di dalam `AdminLayout`.

- **Props Masuk:** Tidak ada
- **Props Keluar:** Tidak ada (tidak meneruskan props ke child)
- **State:** Tidak ada
- **Hooks:** Tidak ada
- **Fungsi:** Tidak ada

---

## 2. `StudentMainContent` (components/StudentMainContent.tsx)

Komponen sentral yang mengatur tampilan tabel, pencarian, pagination, dan membuka dialog edit/hapus.

- **Props Masuk:** Tidak ada
- **Props Keluar (ke child):**
  - `AddStudent` — tidak ada props (self-contained, mengelola `open` sendiri)
  - `BaseTable` — `columns`, `data` (dari `displayStudents`), `enableColumnToggle`, `isLoading`
  - `PaginationWithShow` — `totalItems`, `itemsPerPage`, `currentPage`, `onPageChange`, `onItemsPerPageChange`. Hanya dirender jika total data melebihi `itemsPerPage`
  - `UpdateStudent` — `student` (dari `selectedStudent`), `open` (`dialog === 'update'`), `onOpenChange` (set `dialog` ke `null` jika `open` false)
  - `RemoveStudent` — `student` (dari `selectedStudent`), `open` (`dialog === 'remove'`), `onOpenChange` (set `dialog` ke `null` jika `open` false)

- **State (`useState`):**
  - `search: string` — nilai input pencarian dari topbar
  - `currentPage: number` (default: `1`) — halaman tabel aktif
  - `itemsPerPage: number` (default: `10`) — jumlah baris per halaman
  - `selectedStudent: StudentEntity | null` — data siswa yang dipilih untuk edit/hapus
  - `dialog: 'update' | 'remove' | null` — tipe dialog yang sedang terbuka

- **Hooks:**
  - `useState` — deklarasi semua state di atas
  - `useDebounce(search, 500)` — menghasilkan `debouncedSearch`, mencegah API spam
  - `useStudentIndex({ search: debouncedSearch, page: currentPage, paginate: itemsPerPage })` — fetch data siswa, destructure `{ data: response, isLoading }`
  - `useTopbarActions(topbarConfig)` — mendaftarkan input search ke topbar global; `topbarConfig` di-memoize dengan `useMemo` bergantung pada `search`
  - `useMemo` — untuk `topbarConfig`, `displayStudents`, dan `columns`
  - `useEffect` — reset `currentPage` ke `1` setiap kali `debouncedSearch` atau `itemsPerPage` berubah

- **Variabel:**
  - `debouncedSearch: string` — hasil `useDebounce`
  - `response` — hasil `useStudentIndex`, berisi `data[]` dan `pagination`
  - `displayStudents: StudentEntity[]` — gabungan `response?.data` dan `mockStudents` (data dummy statis, 3 item)
  - `columns` — konfigurasi kolom tabel (memoized): `Nama Siswa` (sortable), `Email`, `No. Telepon` (dengan copy button), `Alamat` (truncate), `Nama Orang Tua` (sortable), `Aksi` (Edit + Hapus icon button)

- **Alur Buka Dialog:**
  - Klik tombol Edit → `setSelectedStudent(student)` + `setDialog('update')`
  - Klik tombol Hapus → `setSelectedStudent(student)` + `setDialog('remove')`
  - Dialog tutup → `onOpenChange(false)` → `setDialog(null)` (tidak mereset `selectedStudent`)

---

## 3. `AddStudent` (components/AddStudent.tsx)

Dialog tambah siswa. Self-contained — mengelola state `open` sendiri tanpa menerima props dari parent.

- **Props Masuk:** Tidak ada
- **Props Keluar (ke child):**
  - `Modal` — `open`, `onOpenChange={setOpen}`, `title`, `description`, `trigger` (Button Tambah Siswa), `footer` (tombol Batal + Submit)
  - `StudentMutationForm` — `mutation={mutation as UseMutationResult}`, `form`, `onSubmit={form.handleSubmit(handleValidSubmit)}`

- **State:**
  - `open: boolean` — dikontrol sendiri via `useState`

- **Hooks:**
  - `useState(false)` → `open`
  - `useStudentCreate()` → `mutation` (tipe `UseMutationResult<StudentCreateResponse, Error, StudentCreatePayload>`)
  - `useForm<StudentCreatePayload>({ resolver: zodResolver(StudentCreateSchema) })` → `form`

- **Efek (`useEffect`):**
  - Dependensi: `[open, reset, mutation]`
  - Guard: hanya berjalan jika `open === true`
  - Aksi: `reset({ name:'', phone:'', email:'', address:'', parent_name:'', user_id:'' })` + `mutation.reset()`

- **Fungsi:**
  - `handleValidSubmit(data: StudentCreatePayload)` — dipanggil oleh `form.handleSubmit`. Urutan: `mutation.reset()` → `await mutation.mutateAsync(data)` → `setOpen(false)`

- **Footer Modal:**
  - Tombol "Batal" → `setOpen(false)`
  - Tombol "Simpan" — `form='student-form'` + `type='submit'`, `disabled={mutation.isPending}`, label berubah ke `'Menyimpan...'` saat pending

---

## 4. `UpdateStudent` (components/UpdateStudent.tsx)

Dialog edit siswa. Menerima data siswa dan state `open` dari parent (`StudentMainContent`).

- **Props Masuk:**
  ```ts
  interface Props {
      student: StudentEntity | null;
      open: boolean;
      onOpenChange: (open: boolean) => void;
  }
  ```

- **Props Keluar (ke child):**
  - `Modal` — `open`, `onOpenChange`, `title="Edit Siswa"`, `description`, `footer` (tombol Batal + Submit)
  - `StudentMutationForm` — `mutation={mutation as UseMutationResult}`, `form`, `onSubmit={form.handleSubmit(handleValidSubmit)}`

- **State:** Tidak ada (state `open` dikontrol sepenuhnya oleh parent)

- **Hooks:**
  - `useStudentUpdate()` → `mutation`
  - `useForm<StudentCreatePayload>({ resolver: zodResolver(StudentCreateSchema) })` → `form`
    - Catatan: **schema dan payload yang digunakan adalah `StudentCreateSchema` / `StudentCreatePayload`**, bukan varian `Update`. Ini sesuai desain karena field form identik.

- **Efek (`useEffect`):**
  - Dependensi: `[open, student, form, mutation]`
  - Guard: hanya berjalan jika `open === true && student !== null`
  - Aksi: `form.reset({ name, email, phone, address, parent_name, user_id })` dengan fallback `|| ''` untuk setiap field, + `mutation.reset()`

- **Fungsi:**
  - `handleValidSubmit(data: StudentCreatePayload)` — `await mutation.mutateAsync({ id: student?.id ?? '', data })` → `onOpenChange(false)`

- **Footer Modal:**
  - Tombol "Batal" → `onOpenChange(false)`
  - Tombol "Simpan Perubahan" — `form='student-form'` + `type='submit'`, `disabled={mutation.isPending}`

---

## 5. `RemoveStudent` (components/RemoveStudent.tsx)

Dialog konfirmasi hapus siswa menggunakan `AlertDialog` (bukan `Modal`).

- **Props Masuk:**
  ```ts
  interface Props {
      student: StudentEntity | null;
      open: boolean;
      onOpenChange: (open: boolean) => void;
  }
  ```

- **Props Keluar:** Hanya ke `AlertDialog` primitives

- **State:** Tidak ada

- **Hooks:**
  - `useStudentDelete()` → destructure `{ mutateAsync, isPending }`

- **Fungsi:**
  - `handleDelete()` — guard: jika `!student` return early. Lalu `await mutateAsync({ id: student.id })`. Sukses: `toast.success(...)` + `onOpenChange(false)`. Catch: `toast.error(...)`

- **UI:**
  - `AlertDialogCancel` — `disabled={isPending}`
  - `AlertDialogAction` — `onClick` memanggil `e.preventDefault()` lalu `handleDelete()`, `disabled={isPending}`, className merah. Label: `'Menghapus...'` saat pending, `'Hapus'` saat idle

---

## 6. `StudentMutationForm` (components/StudentMutationForm.tsx)

Form reusable yang dipakai oleh `AddStudent` maupun `UpdateStudent`. Tidak tahu apakah sedang dipakai untuk tambah atau edit.

- **Props Masuk:**
  ```ts
  interface Props {
      mutation: UseMutationResult;        // cast as UseMutationResult (raw, tanpa generic) dari parent
      form: UseFormReturn<StudentCreatePayload>;
      onSubmit: () => void;               // sudah dibungkus form.handleSubmit() dari parent
  }
  ```

- **Props Keluar:** Tidak ada

- **State:** Tidak ada

- **Hooks:** Tidak ada (destructure `register` dan `formState.errors` langsung dari prop `form`)

- **Struktur Render:**
  ```
  <>
    <form id="student-form" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
      - Nama Siswa       (required, Input, register('name'))
      - Nama Orang Tua   (required, Input, register('parent_name'))
      - grid 2 kolom:
          - Email        (Input type=email, register('email'))
          - No. Telepon  (Input, register('phone'))
      - Alamat           (Textarea rows=3, register('address'))
    </form>
    <SubmitLoading mutation={mutation} />
  </>
  ```

- **Catatan penting:**
  - `id="student-form"` pada `<form>` — menghubungkan tombol submit di footer Modal (`form='student-form'`) dengan form ini
  - `<SubmitLoading>` dirender **di luar** `<form>`, sebagai sibling di Fragment
  - Field `user_id` **tidak dirender** di form (hanya di-reset via `form.reset()` di parent)
  - Semua error message ditampilkan inline di bawah field masing-masing

---

# Pemetaan Lengkap: `services/students`

---

## 7. Schema & Types (schema/StudentSchema.ts)

| Export | Tipe | Keterangan |
|---|---|---|
| `StudentIndexSchema` | `z.object` | Shape entitas dari API |
| `StudentEntity` | `z.infer<typeof StudentIndexSchema>` | Tipe data satu siswa |
| `StudentCreateSchema` | `z.object` | Validasi form tambah/edit |
| `StudentCreatePayload` | `z.infer<typeof StudentCreateSchema>` | Payload POST/PUT ke API |
| `StudentUpdatePayload` | `{ id: string \| number; data: StudentCreatePayload }` | Payload untuk update (dibungkus id) |

---

## 8. Response Types (response/StudentResponse.ts)

| Export | Schema | Keterangan |
|---|---|---|
| `StudentListResponseSchema` / `StudentListResponse` | `BaseResponseSchema(z.array(StudentIndexSchema))` | Respons index/list |
| `StudentCreateResponseSchema` / `StudentCreateResponse` | `BaseResponseSchema(StudentIndexSchema)` | Respons create |
| `StudentUpdateResponseSchema` / `StudentUpdateResponse` | `BaseResponseSchema(StudentIndexSchema)` | Respons update |
| `StudentShowResponseSchema` / `StudentShowResponse` | `BaseResponseSchema(StudentIndexSchema)` | Respons show single |

---

## 9. Hooks CRUD (hooks/useStudentCRUD.ts)

Semua hook wrap `useBase*` dari `@/services/base/hooks/`.

| Hook | Base Hook | Generics | Endpoint |
|---|---|---|---|
| `useStudentIndex(params?)` | `useBaseIndex<StudentListResponse>` | — | `v1/students?...` |
| `useStudentShow(id, params?)` | `useBaseShow<StudentShowResponse>` | — | `v1/students/:id` |
| `useStudentCreate()` | `useBaseCreate<StudentCreatePayload, StudentCreateResponse, StudentEntity>` | T=payload, R=response, Q=entity | `v1/students` POST |
| `useStudentUpdate()` | `useBaseUpdate<StudentUpdatePayload, StudentUpdateResponse, StudentEntity>` | T=payload, R=response, Q=entity | `v1/students/:id` PUT/PATCH |
| `useStudentDelete()` | `useBaseDelete<{ id: string\|number }, GeneralRes, StudentEntity>` | — | `v1/students/:id` DELETE |

- `queryKey` konstanta: `"students"`
- `API_VERSION` konstanta: `"v1"`

---

# Pola Arsitektur (Panduan Replikasi ke Modul Lain)

Pola ini diikuti oleh `features/tutor` dan modul CRUD lainnya.

## Alur Data & Submit

```
StudentMainContent
  └── AddStudent (self-contained, open dikelola sendiri)
        ├── useStudentCreate() → mutation
        ├── useForm<StudentCreatePayload>({ zodResolver })  → form
        ├── useEffect([open]) → reset form + mutation saat modal terbuka
        ├── handleValidSubmit → mutation.reset() + mutateAsync(data) + setOpen(false)
        └── StudentMutationForm(mutation, form, form.handleSubmit(handleValidSubmit))
              └── <form id="student-form"> + <SubmitLoading mutation={mutation} />

  └── UpdateStudent (open dikontrol parent)
        ├── useStudentUpdate() → mutation
        ├── useForm<StudentCreatePayload>({ zodResolver(StudentCreateSchema) }) → form
        ├── useEffect([open, student]) → form.reset(student fields) + mutation.reset()
        ├── handleValidSubmit → mutateAsync({ id, data }) + onOpenChange(false)
        └── StudentMutationForm(mutation, form, form.handleSubmit(handleValidSubmit))

  └── RemoveStudent (open dikontrol parent)
        ├── useStudentDelete() → { mutateAsync, isPending }
        └── handleDelete → mutateAsync({ id }) + toast + onOpenChange(false)
```

## Aturan Pola

1. **Reset di parent, bukan di form** — `StudentMutationForm` tidak punya state atau `useEffect`. Reset dilakukan di `AddStudent`/`UpdateStudent` via `useEffect` yang watch `open`.
2. **Submit via HTML form association** — tombol submit di footer Modal pakai `form='student-form'` + `type='submit'`. Form punya `id='student-form'`.
3. **`mutation as UseMutationResult`** — cast tanpa generics saat diteruskan ke `StudentMutationForm` karena komponen form hanya butuh `mutation` untuk `SubmitLoading`.
4. **Schema create dipakai di update** — `UpdateStudent` memakai `StudentCreateSchema` dan `StudentCreatePayload` untuk form. `StudentUpdatePayload` hanya dipakai di level hook (`useStudentUpdate`).
5. **`user_id` tidak dirender** — field ada di `StudentCreatePayload` dan di-reset via `form.reset()` di parent, tapi tidak ada `<Input>` untuk itu di `StudentMutationForm`.
6. **`SubmitLoading` di luar `<form>`** — dirender sebagai sibling di Fragment, setelah closing tag `</form>`.
