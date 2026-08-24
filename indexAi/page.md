# Dokumentasi Arsitektur Modul Student — Pola DataPageTemplate

Dokumen ini mendokumentasikan arsitektur **terbaru** modul `student` yang menggunakan pola `DataPageTemplate` + `MutationForm`. Pola ini menggantikan pola lama yang menggunakan komponen `AddStudent`, `UpdateStudent`, `RemoveStudent` secara terpisah.

---

## Perubahan Arsitektur (Ringkasan)

| Aspek | Pola Lama | Pola Baru |
|---|---|---|
| Komponen modal add | `AddStudent.tsx` (self-contained) | `DataPageTemplate` + `mutationForm.emptyValues` |
| Komponen modal edit | `UpdateStudent.tsx` (props dari parent) | `DataPageTemplate` + `mutationForm.defaultValues(item)` |
| Komponen dialog delete | `RemoveStudent.tsx` (AlertDialog) | `DataPageTemplate` + `submitActions.delete.onConfirm` |
| Form fields | `StudentMutationForm` (terima `mutation`, `form`, `onSubmit`, `open`) | `StudentMutationForm` (hanya terima `{ form }`) |
| Submit handler | tombol di footer Modal via `form='student-form'` | tombol di `ManagedForm` internal `DataPageTemplate` |
| Reset form | `useEffect` di `AddStudent`/`UpdateStudent` | `ManagedForm` otomatis via `defaultValues` prop |
| Feedback mutasi | `SubmitLoading` di dalam `StudentMutationForm` | `MutationFeedback` internal `ManagedForm` |

---

## 1. `StudentMainContent` (components/StudentMainContent.tsx)

Komponen sentral. Tidak lagi mengandung state `selectedStudent` atau `dialog`. Seluruh manajemen modal dan form diserahkan ke `DataPageTemplate`.

- **Props Masuk:** Tidak ada
- **Props Keluar:** Hanya ke `DataPageTemplate`

- **Hooks:**
  - `useState` — `search`, `currentPage`, `itemsPerPage`
  - `useDebounce(search, 500)` → `debouncedSearch`
  - `useStudentIndex({ search, page, paginate })` → `{ data: response, isLoading }`
  - `useStudentCreate()` → `addMutation`
  - `useStudentUpdate()` → `editMutation`
  - `useStudentDelete()` → `deleteMutation`
  - `useTopbarActions(topbarConfig)` — mendaftarkan search ke topbar
  - `useMemo` — untuk `topbarConfig`, `displayStudents`, `columns`
  - `useEffect` — reset `currentPage` ke `1` saat `debouncedSearch` atau `itemsPerPage` berubah

- **Render:**
  ```tsx
  <DataPageTemplate<StudentEntity, StudentCreatePayload>
      title="Daftar Siswa"
      mutationMode="modal"
      mutationForm={{
          component: StudentMutationForm,
          resolver: zodResolver(StudentCreateSchema),
          emptyValues: { name: '', phone: '', email: '', address: '', parent_name: '' },
          defaultValues: (student) => ({ name, phone, email, address, parent_name }),
      }}
      submitActions={{
          add: {
              label: 'Tambah Siswa',
              modalTitle: 'Tambah Siswa',
              modalSize: 'md',
              onConfirm: async (data) => { await addMutation.mutateAsync(data); },
          },
          edit: {
              modalTitle: (student) => `Edit Siswa — ${student.name}`,
              modalSize: 'md',
              onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
          },
          delete: {
              onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
          },
      }}
  />
  ```

- **Catatan penting — `onConfirm` harus `async/await`:**
  `submitActions.*.onConfirm` harus mengembalikan `Promise<void>`. Karena `mutateAsync` mengembalikan `Promise<TData>` (bukan `void`), selalu wrap dengan `async/await`:
  ```ts
  // BENAR
  onConfirm: async (data) => { await addMutation.mutateAsync(data); }
  // SALAH (type error)
  onConfirm: (data) => addMutation.mutateAsync(data)
  ```

---

## 2. `StudentMutationForm` (components/StudentMutationForm.tsx)

Form field-only yang dipakai untuk Add dan Edit. **Tidak lagi menerima `mutation`, `onSubmit`, atau `open`.**

- **Props Masuk:**
  ```ts
  interface StudentMutationFormProps {
      form: UseFormReturn<StudentCreatePayload>;
  }
  ```

- **Props Keluar:** Tidak ada

- **State / Hooks:** Tidak ada — murni presentasional, destructure `register` dan `formState.errors` dari `form`

- **Struktur Render:**
  ```
  <form className="flex flex-col gap-4" id="student-form">
    - Nama Siswa       (required, Input, register('name'))
    - Nama Orang Tua   (required, Input, register('parent_name'))
    - grid 2 kolom:
        - Email        (Input type=email, register('email'))
        - No. Telepon  (Input, register('phone'))
    - Alamat           (Textarea rows=3, register('address'))
  </form>
  ```

- **Catatan:**
  - `form` di-inject oleh `ManagedForm` internal `DataPageTemplate` — tidak perlu dikelola manual
  - Tidak ada `useEffect` reset — reset dikelola oleh `ManagedForm` via `defaultValues`
  - Tidak ada `SubmitLoading` — feedback mutasi dikelola oleh `MutationFeedback` di `ManagedForm`
  - Field `user_id` **dihapus** dari schema dan form

---

## 3. `DataPageTemplate` — Pola Internal ManagedForm

Ketika `mutationForm` di-pass ke `DataPageTemplate`, template akan:

1. Render tombol "Tambah" di header (jika `submitActions.add` ada)
2. Saat tombol diklik → buka `Modal` → render `ManagedForm` dengan `emptyValues`
3. Saat tombol edit diklik → buka `Modal` → render `ManagedForm` dengan `defaultValues(item)`
4. `ManagedForm` mengelola:
   - `useForm<TData>({ resolver, defaultValues })` secara internal
   - Submit button + Cancel button di footer (`cancelLabel="Batal"`, `onCancel=onDone`)
   - `MutationFeedback` (loading overlay + toast sukses/error)
   - Memanggil `form.reset()` setelah sukses, lalu tutup modal setelah 1800ms

---

## 4. Schema (`services/students/schema/StudentSchema.ts`)

```ts
StudentCreateSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional().nullable(),
    email: z.string().email().optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable(),
    parent_name: z.string().min(1),
    // user_id DIHAPUS — tidak lagi bagian dari form payload
})
```

- `user_id` dihapus dari `StudentCreateSchema` dan semua `form.reset()` yang memakainya

---

## 5. Aturan Pola Baru (DataPageTemplate Pattern)

### A. `onConfirm` selalu `async/await`
Semua `onConfirm` di `submitActions` harus return `Promise<void>`:
```ts
onConfirm: async (data) => { await mutation.mutateAsync(data); }
```

### B. `MutationForm.component` hanya terima `{ form }`
Komponen form field-only harus memiliki interface:
```ts
interface XxxMutationFormProps {
    form: UseFormReturn<XxxCreatePayload>;
}
```
Tidak ada `mutation`, `onSubmit`, `open`, atau state lain.

### C. Reset form otomatis
Tidak perlu `useEffect` reset di komponen form. `ManagedForm` otomatis memakai `emptyValues` (add) atau `defaultValues(item)` (edit) sebagai `defaultValues` untuk `useForm`.

### D. Footer Cancel selalu ada
`renderManagedAddForm` dan `renderManagedEditForm` keduanya mem-pass `cancelLabel="Batal"` dan `onCancel={onDone}` ke `ManagedForm`, sehingga tombol Batal selalu muncul di kedua modal.

### E. TypeScript — `DefaultValues` cast
Di `ManagedForm`, `defaultValues` di-cast ke `DefaultValues<TData>` saat passing ke `useForm`:
```ts
useForm<TData>({ resolver, defaultValues: defaultValues as DefaultValues<TData> })
```
Dan `form` di-cast saat diteruskan ke `FormComponent`:
```tsx
<FormComponent form={form as unknown as UseFormReturn<TData>} />
```

### F. `resolve()` constraint
Fungsi `resolve` di `DataPageTemplate` menggunakan constraint `R extends string | undefined` agar kompatibel dengan prop `title?: string` dan `description?: string` milik `Modal`:
```ts
function resolve<T, R extends string | undefined>(value: R | ((item: T) => R) | undefined, item: T): R | undefined
```

---

## 6. Aturan Penambahan Creator
Jika field create pada suatu service isinya kurang dari 4 maka, perlu tambahkan `creator` pada index, dan pada maincontent perlu menampilkan `creator`, `created_at`, dan `updated_at`.
