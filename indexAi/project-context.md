# PROJECT CONTEXT & BEHAVIOR RULES (Vite Project)

## 1. System Role & Architecture Context
- **Framework:** Vite + React / Vue (Sesuaikan dengan framework utama Anda)
- **Primary Objective:** Menjaga konsistensi arsitektur, pola koding, dan stabilitas project saat membuat, merubah, atau menghapus komponen/halaman.
- **Principle:** AI *harus* membaca dan memahami struktur folder serta konvensi yang ada sebelum mengusulkan atau mengeksekusi perubahan kode.

---

## 2. Directory & File Naming Conventions
- **Pages/Views:** Disimpan di `src/pages/` atau `src/views/`. Penamaan file menggunakan `PascalCase` (contoh: `UserProfile.tsx`) atau `kebab-case` jika folder-based (`user-profile/index.tsx`).
- **Components:** Disimpan di `src/components/`. Gunakan modularisasi (Reusable components seperti Button, Input, Modal harus dipisah dari halaman utama).
- **Routing:** Daftarkan setiap halaman baru di file router utama (`src/routes/` atau `src/App.tsx`).
- **State & Utilities:** Helper functions di `src/utils/`, custom hooks/composables di `src/hooks/` atau `src/composables/`.

---

## 3. Strict Rules for Page Operations

### A. Creating a New Page (CREATE)
1. **Check Existing Patterns:** Selalu gunakan template/layout yang sudah ada (misal: `<MainLayout>`, Navbar, Sidebar).
2. **File Structure:**
   - Buat file baru di `src/pages/[NamaPage]`.
   - Pisahkan logic/state dari UI jika kompleks (gunakan custom hook atau helper).
3. **Routing Integration:** Wajib tambahkan rute baru ke file konfigurasi router tanpa mengubah/merusak rute yang sudah ada.
4. **Types/Interfaces:** Jika menggunakan TypeScript, definisikan interface/type untuk props dan state di file terpisah atau di bagian atas file.

### B. Editing an Existing Page (EDIT/UPDATE)
1. **Preserve Structure:** Dilarang refactor total struktur file tanpa instruksi eksplisit. Ikuti *coding style* dan skema variabel yang sedang digunakan.
2. **Atomic Changes:** Ubah hanya bagian yang diminta. Jangan menghapus imports, types, atau fungsi yang tidak berhubungan dengan tugas saat ini.
3. **State Management:** Jangan mengganti lib state (misal: dari Zustand ke Redux, atau Context ke Pinia) kecuali diminta.

### C. Deleting a Page (DELETE)
1. **Clean Route:** Hapus atau unregister route terkait dari file router utama.
2. **Clean Imports:** Hapus semua ekspor/impor yang merujuk ke halaman yang dihapus di file lain.
3. **Check Dependencies:** Pastikan tidak ada komponen lain yang menggantung (*broken imports*) setelah halaman dihapus.

---

## 4. Code Quality & Performance Guidelines
- **Imports:** Kelompokkan import secara rapi (1. External libs, 2. Internal components, 3. Assets/Styles/Types).
- **Styling:** Gunakan sistem CSS yang sudah ada di project (e.g., Tailwind CSS / CSS Modules). Jangan mencampur metode styling baru tanpa izin.
- **Error Handling & Loading States:** Setiap halaman yang melakukan fetch data wajib menangani state `loading`, `error`, dan `empty`.
- **Clean Code:** Hapus `console.log` dan kode mati (dead code) sebelum memberikan hasil akhir.

---

## 5. Standard AI Execution Protocol
Setiap kali diminta membuat, mengedit, atau menghapus halaman/fitur, ikuti urutan respons berikut:
1. **Analysis:** Sebutkan file apa saja yang akan dibuat, diubah, atau dihapus.
2. **Action:** Berikan potongan kode yang lengkap (bukan snippet terpotong) atau jelaskan perubahan secara presisi.
3. **Verification Checklist:** Konfirmasi bahwa rute telah terpasang, tipe data aman (tidak ada type error), dan styling konsisten dengan halaman lain.
