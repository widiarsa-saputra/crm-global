# Modul: Role & Permission

**Fungsi Singkat**:
Modul keamanan krusial untuk mendefinisikan level hak akses (_Role_) serta wewenang granular (_Permissions_) untuk membatasi fungsionalitas dan tampilan sesuai wewenang.

**Mapping File Utama**:
- **Pages Utama Role**: 
  - `src/features/role/pages/RolePage.tsx`
  - `src/features/role/pages/RoleUsersAssignedPage.tsx` (Daftar *User* untuk suatu *Role*)
  - `src/features/role/pages/RolePermissionsAssignedPage.tsx` (Daftar *Permission* dari suatu *Role*)
- **Components Role**: 
  - `src/features/role/components/`
- **Pages Permission**: 
  - `src/features/permission/pages/PermissionsPage.tsx`
- **Components Permission**: 
  - `src/features/permission/components/`
- **Services (API)**: 
  - `src/services/role/` (API khusus _Roles_)
  - `src/services/permission/` (API khusus _Permissions_)
  - `src/services/role-permission/` (API penjembatan/asiosiasi)

**Panduan Penambahan Fitur & Maintenance**:
- Otorisasi halaman atau komponen HARUS menggunakan perizinan berbasis string (contoh: `"view_dashboard"`) bukan mematok identitas hardcoded seperti `role_id === 1`. 
- Pengecekan perizinan ini akan bergantung pada _provider_ atau _hooks_ di modul Auth.
