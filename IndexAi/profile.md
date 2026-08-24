# Modul: Profile

**Fungsi Singkat**:
Mewadahi kebutuhan pengguna yang sedang login untuk memeriksa dan memutakhirkan informasi dasar pribadinya sendiri (Nama, Avatar/Foto, Ganti Kata Sandi).

**Mapping File Utama**:
- **Pages**: 
  - `src/features/profile/pages/ProfilePage.tsx`
- **Components**: 
  - `src/features/profile/components/` (Komponen untuk form profil atau manajemen passsword)
- **Services (API)**: 
  - `src/services/profile/`

**Panduan Penambahan Fitur & Maintenance**:
- Saat ada fitur untuk mengubah informasi diri (contoh: nama), pastikan respons API dari mutasi `react-query` juga memperbarui `['auth', 'me']` agar Navbar/TopBar secara reaktif langsung menampilkan identitas yang baru tanpa _refresh_ halaman.
