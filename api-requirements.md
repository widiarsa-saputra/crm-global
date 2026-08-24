# API Requirements — Bimbel Admin Portal

> Base URL: `{VITE_API_BASE_URL}/v1`
> Auth: Bearer Token (Authorization header)
> Content-Type: `application/json` (kecuali upload file: `multipart/form-data`)

---

## 📐 Base Response Format

Semua endpoint mengembalikan struktur response berikut:

```json
{
  "success": true,
  "message": "string",
  "code": 200,
  "data": { ... } | [ ... ] | null,
  "pagination": {
    "current_page": 1,
    "from": 1,
    "to": 10,
    "total": 100,
    "per_page": 10,
    "last_page": 10,
    "next_page": 2,
    "prev_page": null,
    "path": "string"
  }
}
```

### Base Entity Fields
Setiap resource entity selalu memiliki fields berikut:
| Field | Type | Keterangan |
|---|---|---|
| `id` | `string \| number` | Primary key |
| `created_at` | `string` | ISO 8601 datetime |
| `updated_at` | `string` | ISO 8601 datetime |

---

## 1. Authentication & Profile

### `GET /v1/me`
Mendapatkan data user yang sedang login.

**Response Data:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "created_at": "string",
  "updated_at": "string",
  "photo_url": "string | null",
  "roles": [
    { "id": 1, "name": "string", "display_name": "string" }
  ],
  "permissions": [
    { "id": 1, "name": "string", "display_name": "string", "group": "string" }
  ]
}
```

---

### `PUT /v1/me`
Update profil user login.

**Payload:**
```json
{}
```
> _(body kosong / field dinamis sesuai kebutuhan)_

---

### `POST /v1/change-photo`
Upload foto profil.

**Content-Type:** `multipart/form-data`

**Payload:**
| Field | Type | Keterangan |
|---|---|---|
| `photo` | `File` | File gambar |

**Response Data:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "email_verified_at": "string | null",
  "phone": "string",
  "created_at": "string",
  "updated_at": "string",
  "photo": "string | null",
  "photo_url": "string | null"
}
```

---

### `PUT /v1/change-password`
Ganti password user login.

**Payload:**
```json
{
  "current_password": "string",
  "new_password": "string",
  "new_password_confirmation": "string"
}
```

---

## 2. Users

### `GET /v1/users`
Daftar semua user.

**Query Params:** `?page=1&per_page=10&search=...`

**Response Data:** `Array<User>`

---

### `POST /v1/users`
Buat user baru.

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `name` | `string` | ✅ | Min 1 karakter |
| `email` | `string` | ✅ | Format email valid |
| `phone` | `string` | ❌ | Nomor telepon |
| `password` | `string` | ✅ | Min 8 karakter |

---

### `PUT /v1/users/:id`
Update data user.

**Payload:** (semua opsional)
| Field | Type | Keterangan |
|---|---|---|
| `name` | `string` | Min 1 karakter |
| `email` | `string` | Format email valid |
| `phone` | `string` | |
| `password` | `string` | Min 8 karakter |

---

### `DELETE /v1/users/:id`
Hapus user.

---

### `GET /v1/users/export`
Export daftar user ke file (Excel/CSV).

**Response:** File download (`blob`)

---

### `POST /v1/users/import`
Import user dari file Excel.

**Content-Type:** `multipart/form-data`

**Payload:**
| Field | Type |
|---|---|
| `file` | `File` |

---

### `POST /v1/users/import-preview`
Preview import sebelum dieksekusi.

**Content-Type:** `multipart/form-data`

**Payload:** sama dengan import

---

### `GET /v1/users/import-template`
Download template file import user.

**Response:** File download (`blob`)

---

## 3. Roles & Permissions

### `GET /v1/roles`
Daftar semua role.

### `POST /v1/roles`
Buat role baru.

**Payload:**
| Field | Type | Required |
|---|---|---|
| `name` | `string` | ✅ |
| `display_name` | `string` | ✅ |

### `PUT /v1/roles/:id`
Update role.

### `DELETE /v1/roles/:id`
Hapus role.

---

### `GET /v1/permissions`
Daftar semua permission.

---

### `POST /v1/role-permissions/sync-permissions`
Sync permissions ke role.

**Payload:**
```json
{
  "role_id": "string | number",
  "permission_ids": ["string | number"]
}
```

---

### `POST /v1/user-roles/sync-users`
Assign role ke banyak user.

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `user_ids` | `string[]` | ✅ | Array user ID |
| `role` | `string \| null` | ❌ | Nama role |

---

### `POST /v1/user-roles/sync-roles`
Sync roles untuk satu user.

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `user_id` | `string` | ✅ | |
| `roles` | `string[]` | ❌ | Array nama role |

---

## 4. Students (Siswa)

**Base URL:** `/v1/students`

### `GET /v1/students`
Daftar siswa.

### `GET /v1/students/:id`
Detail siswa.

### `POST /v1/students`
Buat siswa baru.

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `name` | `string` | ✅ | Min 1 karakter |
| `phone` | `string` | ❌ | |
| `email` | `string` | ❌ | Format email valid |
| `address` | `string` | ❌ | |
| `parent_name` | `string` | ✅ | Min 1 karakter |
| `user_id` | `string` | ❌ | FK ke users |

**Response Data (Entity):**
```json
{
  "id": "string|number",
  "name": "string|null",
  "phone": "string|null",
  "email": "string|null",
  "address": "string|null",
  "parent_name": "string|null",
  "user_id": "string|null",
  "created_at": "string",
  "updated_at": "string"
}
```

### `PUT /v1/students/:id`
Update data siswa. Payload sama (semua opsional).

### `DELETE /v1/students/:id`
Hapus siswa.

---

## 5. Tutors (Pengajar)

**Base URL:** `/v1/tutors`

### `GET /v1/tutors`
### `GET /v1/tutors/:id`
### `POST /v1/tutors`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `name` | `string` | ✅ | Min 1 karakter |
| `email` | `string` | ❌ | Format email valid |
| `phone` | `string` | ❌ | |
| `address` | `string` | ❌ | |
| `description` | `string` | ✅ | Min 1 karakter |

**Response Data (Entity):**
```json
{
  "id": "string|number",
  "name": "string|null",
  "email": "string|null",
  "phone": "string|null",
  "address": "string|null",
  "description": "string|null",
  "created_at": "string",
  "updated_at": "string"
}
```

### `PUT /v1/tutors/:id`
### `DELETE /v1/tutors/:id`

---

## 6. Tutor Availabilities

**Base URL:** `/v1/tutor-availabilities`

### `GET /v1/tutor-availabilities`
### `GET /v1/tutor-availabilities/:id`
### `POST /v1/tutor-availabilities`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `tutor_id` | `string \| number` | ❌ | FK ke tutors |
| `day_of_week` | `number` | ❌ | 0=Minggu, 1=Senin, ..., 6=Sabtu |
| `start_time` | `string` | ❌ | Format HH:mm |
| `end_time` | `string` | ❌ | Format HH:mm |
| `is_active` | `boolean` | ❌ | |

### `PUT /v1/tutor-availabilities/:id`
### `DELETE /v1/tutor-availabilities/:id`

---

## 7. Classes (Kelas)

**Base URL:** `/v1/classes`

### `GET /v1/classes`
### `GET /v1/classes/:id`
### `POST /v1/classes`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `name` | `string` | ✅ | Min 1 karakter |
| `is_active` | `'1' \| '0'` | ❌ | Status aktif |

### `PUT /v1/classes/:id`
### `DELETE /v1/classes/:id`

---

## 8. Course Categories

**Base URL:** `/v1/course-categories`

### `GET /v1/course-categories`
### `GET /v1/course-categories/:id`
### `POST /v1/course-categories`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `course_id` | `string \| number` | ❌ | FK ke courses |
| `name` | `string` | ✅ | Min 1 karakter |
| `slug` | `string` | ❌ | |
| `icon` | `string` | ❌ | |
| `description` | `string` | ❌ | |
| `is_active` | `'1' \| '0'` | ❌ | |

### `PUT /v1/course-categories/:id`
### `DELETE /v1/course-categories/:id`

---

## 9. Courses (Kursus)

**Base URL:** `/v1/courses`

### `GET /v1/courses`
### `GET /v1/courses/:id`
### `POST /v1/courses`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `category_id` | `string \| number` | ❌ | FK ke course-categories |
| `title` | `string` | ✅ | Min 1 karakter |
| `slug` | `string` | ❌ | |
| `short_description` | `string` | ❌ | |
| `description` | `string` | ❌ | |
| `level` | `string` | ✅ | `beginner \| intermediate \| advanced \| all_level` |
| `price` | `number` | ❌ | |
| `discount_price` | `number` | ❌ | |
| `thumbnail` | `string` | ❌ | URL thumbnail |
| `trailer_video_url` | `string` | ❌ | |
| `status` | `string` | ✅ | `draft \| review \| published \| archived` |
| `created_by` | `string` | ❌ | FK ke users |

### `PUT /v1/courses/:id`
### `DELETE /v1/courses/:id`

---

## 10. Course Sections

**Base URL:** `/v1/course-sections`

### `GET /v1/course-sections`
### `GET /v1/course-sections/:id`
### `POST /v1/course-sections`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `course_id` | `string \| number` | ❌ | FK ke courses |
| `title` | `string` | ✅ | Min 1 karakter |
| `sort_order` | `number` | ❌ | Urutan tampil |

### `PUT /v1/course-sections/:id`
### `DELETE /v1/course-sections/:id`

---

## 11. Lessons

**Base URL:** `/v1/lessons`

### `GET /v1/lessons`
### `GET /v1/lessons/:id`
### `POST /v1/lessons`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `section_id` | `string \| number` | ❌ | FK ke course-sections |
| `title` | `string` | ✅ | Min 1 karakter |
| `slug` | `string` | ❌ | |
| `type` | `string` | ✅ | `video \| article \| pdf \| quiz` |
| `content_body` | `string` | ❌ | Konten teks/HTML |
| `attachment_url` | `string` | ❌ | URL lampiran |

### `PUT /v1/lessons/:id`
### `DELETE /v1/lessons/:id`

---

## 12. Lesson Completions

**Base URL:** `/v1/lesson-completions`

### `GET /v1/lesson-completions`
### `GET /v1/lesson-completions/:id`

**Response Data (Entity):**
```json
{
  "id": "string|number",
  "student_id": "string|number|null",
  "lesson_id": "string|number|null",
  "lesson_title": "string|null",
  "lesson_type": "string|null",
  "duration_watched": "number|null",
  "completed_at": "string|null",
  "created_at": "string",
  "updated_at": "string"
}
```

> ℹ️ Endpoint ini hanya **read-only** (tidak ada POST/PUT/DELETE).

---

## 13. Batches

**Base URL:** `/v1/batches`

### `GET /v1/batches`
### `GET /v1/batches/:id`
### `POST /v1/batches`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `course_id` | `string \| number` | ❌ | FK ke courses |
| `lead_tutor_id` | `string \| number` | ❌ | FK ke tutors |
| `name` | `string` | ✅ | Min 1 karakter |
| `start_date` | `string` | ❌ | Format tanggal |
| `end_date` | `string` | ❌ | Format tanggal |
| `max_capacity` | `number` | ❌ | Kapasitas maksimum |
| `status` | `string` | ✅ | `registration_open \| ongoing \| completed \| cancelled` |

### `PUT /v1/batches/:id`
### `DELETE /v1/batches/:id`

---

## 14. Batch Members

**Base URL:** `/v1/batch-members`

### `GET /v1/batch-members`
### `GET /v1/batch-members/:id`
### `POST /v1/batch-members`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `batch_id` | `string \| number` | ❌ | FK ke batches |
| `student_id` | `string \| number` | ❌ | FK ke students |
| `enrollment_id` | `string \| number` | ❌ | FK ke program-enrollments |
| `joined_at` | `string` | ❌ | Tanggal bergabung |

### `PUT /v1/batch-members/:id`
### `DELETE /v1/batch-members/:id`

---

## 15. Batch Schedules

**Base URL:** `/v1/batch-schedules`

### `GET /v1/batch-schedules`
### `GET /v1/batch-schedules/:id`
### `POST /v1/batch-schedules`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `batch_id` | `string \| number` | ❌ | FK ke batches |
| `tutor_id` | `string \| number` | ❌ | FK ke tutors |
| `lesson_id` | `string \| number` | ❌ | FK ke lessons |
| `title` | `string` | ✅ | Min 1 karakter |
| `scheduled_at` | `string` | ❌ | ISO datetime |
| `duration_minutes` | `number` | ❌ | Durasi dalam menit |
| `meeting_url` | `string` | ❌ | URL meeting online |
| `recording_url` | `string` | ❌ | URL rekaman |
| `tutor_notes` | `string` | ❌ | Catatan tutor |
| `status` | `string` | ✅ | `scheduled \| live \| completed \| cancelled \| rescheduled` |

### `PUT /v1/batch-schedules/:id`
### `DELETE /v1/batch-schedules/:id`

---

## 16. Private Bookings

**Base URL:** `/v1/private-bookings`

### `GET /v1/private-bookings`
### `GET /v1/private-bookings/:id`
### `POST /v1/private-bookings`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `enrollment_id` | `string \| number` | ❌ | FK ke program-enrollments |
| `student_id` | `string \| number` | ❌ | FK ke students |
| `tutor_id` | `string \| number` | ❌ | FK ke tutors |
| `lesson_id` | `string \| number` | ❌ | FK ke lessons |
| `scheduled_at` | `string` | ❌ | ISO datetime |
| `duration_minutes` | `number` | ❌ | Durasi dalam menit |
| `meeting_url` | `string` | ❌ | URL meeting |
| `student_notes` | `string` | ❌ | Catatan siswa |
| `tutor_feedback` | `string` | ❌ | Feedback tutor |
| `status` | `string` | ✅ | `pending \| confirmed \| live \| completed \| cancelled \| no_show` |

### `PUT /v1/private-bookings/:id`
### `DELETE /v1/private-bookings/:id`

---

## 17. Session Attendances

**Base URL:** `/v1/session-attendances`

### `GET /v1/session-attendances`
### `GET /v1/session-attendances/:id`
### `POST /v1/session-attendances`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `session_type` | `string` | ✅ | `batch \| private` |
| `batch_schedule_id` | `string \| number` | ❌ | FK ke batch-schedules |
| `private_booking_id` | `string \| number` | ❌ | FK ke private-bookings |
| `user_id` | `string \| number` | ❌ | FK ke users |
| `attendance_status` | `string` | ✅ | `present \| absent \| late \| excused` |
| `joined_at` | `string` | ❌ | ISO datetime |

### `PUT /v1/session-attendances/:id`
### `DELETE /v1/session-attendances/:id`

---

## 18. Program Enrollments

**Base URL:** `/v1/program-enrollments`

### `GET /v1/program-enrollments`
### `GET /v1/program-enrollments/:id`
### `POST /v1/program-enrollments`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `student_id` | `string \| number` | ❌ | FK ke students |
| `course_id` | `string \| number` | ❌ | FK ke courses |
| `program_type` | `string` | ✅ | `batch \| private` |
| `total_sessions` | `number` | ❌ | Total sesi yang dibeli |
| `used_sessions` | `number` | ❌ | Sesi yang sudah digunakan |
| `expires_at` | `string` | ❌ | Tanggal kedaluwarsa |
| `status` | `string` | ✅ | `active \| completed \| expired \| cancelled` |

### `PUT /v1/program-enrollments/:id`
### `DELETE /v1/program-enrollments/:id`

---

## 19. Invoices

**Base URL:** `/v1/invoices`

### `GET /v1/invoices`
### `GET /v1/invoices/:id`
### `POST /v1/invoices`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `student_id` | `string \| number` | ❌ | FK ke students |
| `enrollment_id` | `string \| number` | ❌ | FK ke program-enrollments |
| `booking_id` | `string \| number` | ❌ | FK ke private-bookings |
| `invoice_type` | `string` | ✅ | `enrollment \| private_booking \| other` |
| `description` | `string` | ✅ | Min 1 karakter |
| `amount` | `number` | ✅ | Min 0 |
| `discount` | `number` | ❌ | Min 0 |
| `tax` | `number` | ❌ | Min 0 |
| `due_date` | `string` | ❌ | Tanggal jatuh tempo |
| `notes` | `string` | ❌ | |

**Response Data tambahan (computed):**
| Field | Type | Keterangan |
|---|---|---|
| `invoice_number` | `string` | Nomor invoice auto-generate |
| `total_due` | `number` | Total tagihan |
| `total_paid` | `number` | Total dibayar |
| `remaining_due` | `number` | Sisa tagihan |
| `status` | `string` | `unpaid \| partial \| paid \| cancelled` |
| `student_name` | `string` | Nama siswa (denormalized) |
| `enrollment_label` | `string` | Label enrollment |
| `booking_label` | `string` | Label booking |

### `PUT /v1/invoices/:id`
### `DELETE /v1/invoices/:id`

---

## 20. Transactions (Pembayaran)

**Base URL:** `/v1/transactions`

### `GET /v1/transactions`
### `GET /v1/transactions/:id`
### `POST /v1/transactions`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `invoice_id` | `string \| number` | ❌ | FK ke invoices |
| `student_id` | `string \| number` | ❌ | FK ke students |
| `payment_method` | `string` | ✅ | `transfer \| cash \| midtrans \| other` |
| `amount` | `number` | ✅ | Min 1 |
| `payment_date` | `string` | ✅ | Tanggal pembayaran |
| `reference_number` | `string` | ❌ | Nomor referensi |
| `notes` | `string` | ❌ | |

**Response Data tambahan (denormalized):**
| Field | Type | Keterangan |
|---|---|---|
| `invoice_number` | `string` | |
| `student_name` | `string` | |
| `recorded_by_name` | `string` | |

### `PUT /v1/transactions/:id`
### `DELETE /v1/transactions/:id`

---

## 21. Tutor Timesheets

**Base URL:** `/v1/tutor-timesheets`

### `GET /v1/tutor-timesheets`
### `GET /v1/tutor-timesheets/:id`
### `POST /v1/tutor-timesheets`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `tutor_id` | `string \| number` | ❌ | FK ke tutors |
| `session_type` | `string` | ✅ | `batch \| private` |
| `batch_schedule_id` | `string \| number` | ❌ | FK ke batch-schedules |
| `private_booking_id` | `string \| number` | ❌ | FK ke private-bookings |
| `base_rate` | `number` | ❌ | Tarif dasar |
| `bonus_amount` | `number` | ❌ | Bonus |
| `total_pay` | `number` | ❌ | Total bayar |
| `payment_status` | `string` | ✅ | `unpaid \| in_process \| paid` |
| `paid_at` | `string` | ❌ | ISO datetime |

### `PUT /v1/tutor-timesheets/:id`
### `DELETE /v1/tutor-timesheets/:id`

---

## 22. Question Banks (Bank Soal)

**Base URL:** `/v1/question-banks`

### `GET /v1/question-banks`
### `GET /v1/question-banks/:id`
### `POST /v1/question-banks`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `category_id` | `string \| number` | ❌ | FK ke course-categories |
| `lesson_id` | `string \| number` | ❌ | FK ke lessons |
| `question_type` | `string` | ✅ | `multiple_choice \| multiple_select \| essay` |
| `difficulty` | `string` | ✅ | `easy \| medium \| hard \| hots` |
| `question_text` | `string` | ✅ | Teks soal |
| `question_image_url` | `string` | ❌ | URL gambar soal |
| `options_payload` | `string` | ❌ | JSON string pilihan jawaban |
| `correct_answer` | `string` | ✅ | Kunci jawaban |
| `explanation` | `string` | ❌ | Pembahasan |
| `created_by` | `string \| number` | ❌ | FK ke users |

### `PUT /v1/question-banks/:id`
### `DELETE /v1/question-banks/:id`

---

## 23. Tryouts

**Base URL:** `/v1/tryouts`

### `GET /v1/tryouts`
### `GET /v1/tryouts/:id`
### `POST /v1/tryouts`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `course_id` | `string \| number` | ❌ | FK ke courses |
| `title` | `string` | ✅ | Min 1 karakter |
| `slug` | `string` | ❌ | |
| `description` | `string` | ❌ | |
| `duration_minutes` | `number` | ✅ | Min 1 |
| `passing_grade` | `number` | ❌ | Nilai kelulusan |
| `scoring_system` | `string` | ✅ | `standard \| irt \| raw_points` |
| `start_time` | `string` | ❌ | ISO datetime |
| `end_time` | `string` | ❌ | ISO datetime |
| `is_published` | `boolean` | ❌ | Default: `false` |

### `PUT /v1/tryouts/:id`
### `DELETE /v1/tryouts/:id`

---

## 24. Tryout Subtests

**Base URL:** `/v1/tryout-subtests`

### `GET /v1/tryout-subtests`
### `GET /v1/tryout-subtests/:id`
### `POST /v1/tryout-subtests`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `tryout_id` | `string \| number` | ❌ | FK ke tryouts |
| `name` | `string` | ✅ | Min 1 karakter |
| `sort_order` | `number` | ✅ | Min 0 |
| `duration_minutes` | `number` | ✅ | Min 1 |

### `PUT /v1/tryout-subtests/:id`
### `DELETE /v1/tryout-subtests/:id`

---

## 25. Tryout Questions

**Base URL:** `/v1/tryout-questions`

### `GET /v1/tryout-questions`
### `GET /v1/tryout-questions/:id`
### `POST /v1/tryout-questions`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `tryout_id` | `string \| number` | ❌ | FK ke tryouts |
| `question_id` | `string \| number` | ❌ | FK ke question-banks |
| `section_name` | `string` | ❌ | Nama seksi/subtes |
| `sort_order` | `number` | ✅ | Min 0 |
| `weight_score` | `number` | ❌ | Bobot nilai, default 1.0 |

### `PUT /v1/tryout-questions/:id`
### `DELETE /v1/tryout-questions/:id`

---

## 26. Tryout Attempts

**Base URL:** `/v1/tryout-attempts`

### `GET /v1/tryout-attempts`
### `GET /v1/tryout-attempts/:id`
### `POST /v1/tryout-attempts`

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `tryout_id` | `string \| number` | ❌ | FK ke tryouts |
| `student_id` | `string \| number` | ❌ | FK ke students |
| `started_at` | `string` | ❌ | ISO datetime |
| `submitted_at` | `string` | ❌ | ISO datetime |
| `answers_payload` | `string` | ❌ | JSON string jawaban |
| `total_correct` | `number` | ❌ | Default 0 |
| `total_wrong` | `number` | ❌ | Default 0 |
| `final_score` | `number` | ❌ | Nilai akhir |
| `status` | `string` | ✅ | `in_progress \| submitted \| graded \| abandoned` |

### `PUT /v1/tryout-attempts/:id`
### `DELETE /v1/tryout-attempts/:id`

---

## 27. Tryout Item Parameters (IRT)

**Base URL:** `/v1/tryout-item-parameters`

### `GET /v1/tryout-item-parameters`
Daftar parameter butir soal.

**Response Data (Entity):**
```json
{
  "id": "string|number",
  "question_id": "string|number|null",
  "subtest_id": "string|number|null",
  "question_number": "number|null",
  "difficulty_b": "number|null",
  "difficulty_label": "string|null",
  "discrimination_a": "number|null",
  "guessing_c": "number|null",
  "correct_count": "number|null",
  "total_responses": "number|null",
  "correct_rate_percentage": "number|null",
  "created_at": "string",
  "updated_at": "string"
}
```

### `POST /v1/calculate-irt`
Kalkulasi parameter IRT.

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `model` | `string` | ❌ | `1PL \| 2PL \| 3PL`, default `3PL` |
| `tryout_id` | `string \| number` | ❌ | FK ke tryouts |
| `subtest_ids` | `Array<string\|number>` | ❌ | Filter per subtest |

---

## 28. Tryout Subtest Scores

**Base URL:** `/v1/tryout-subtest-scores`

### `GET /v1/tryout-subtest-scores`
### `GET /v1/tryout-subtest-scores/:id`

**Response Data (Entity):**
```json
{
  "id": "string|number",
  "tryout_id": "string|number|null",
  "student_id": "string|number|null",
  "student_name": "string|null",
  "rank": "number|null",
  "percentile": "number|null",
  "average_scaled_score": "number|null",
  "subtest_breakdown": [
    {
      "subtest_id": "string|number|null",
      "subtest_name": "string|null",
      "raw_correct": "number|null",
      "total_questions": "number|null",
      "theta_score": "number|null",
      "scaled_score": "number|null",
      "passing_grade_target": "number|null",
      "status": "string|null"
    }
  ],
  "created_at": "string",
  "updated_at": "string"
}
```

---

## 29. Student Progress

**Base URL:** `/v1/student-progress`

### `GET /v1/student-progress`
Daftar progress bulanan semua siswa.

**Response Data (Entity):**
```json
{
  "id": "string|number",
  "student_id": "string|number|null",
  "student_name": "string|null",
  "parent_name": "string|null",
  "period_year": "number|null",
  "period_month": "number|null",
  "period_label": "string|null",
  "sessions_attended": "number|null",
  "sessions_total": "number|null",
  "attendance_rate": "number|null",
  "tryouts_completed": "number|null",
  "avg_scaled_score": "number|null",
  "best_scaled_score": "number|null",
  "avg_rank_in_batch": "number|null",
  "lessons_completed": "number|null",
  "lessons_total": "number|null",
  "lesson_completion_rate": "number|null",
  "calculated_at": "string|null",
  "created_at": "string",
  "updated_at": "string"
}
```

### `GET /v1/student-progress/:id`
Detail progress siswa beserta trend chart.

**Response Data:**
```json
{
  "student_id": "string|number|null",
  "student_name": "string|null",
  "parent_name": "string|null",
  "latest": { "...MonthlyProgressEntity" },
  "trend": [
    {
      "period_label": "string|null",
      "period_year": "number|null",
      "period_month": "number|null",
      "attendance_rate": "number|null",
      "avg_scaled_score": "number|null",
      "lesson_completion_rate": "number|null",
      "tryouts_completed": "number|null"
    }
  ]
}
```

### `POST /v1/calculate-student-progress`
Trigger kalkulasi progress bulanan.

**Payload:**
| Field | Type | Required | Keterangan |
|---|---|---|---|
| `month` | `number` | ✅ | 1–12 |
| `year` | `number` | ✅ | Min 2020 |

---

## 30. Notification Service

### WhatsApp

#### `GET api/auth/status` _(WhatsApp service base URL)_
Status koneksi WhatsApp.

**Response:**
```json
{ "status": "string", "message": "string" }
```

#### `GET api/auth/qr`
QR code untuk login WhatsApp.

**Response:**
```json
{
  "qr": "string",
  "qrImage": "string",
  "message": "string",
  "status": "string"
}
```

#### `GET /v1/notification-services/whatsapp`
Detail session WhatsApp aktif.

#### `PUT /v1/notification-services/whatsapp/session`
Update session WhatsApp.

#### `DELETE /v1/notification-services/whatsapp`
Hapus/disconnect session WhatsApp.

#### `POST /v1/notification-services/whatsapp/messages`
Kirim pesan WhatsApp.

**Payload:**
```json
{
  "to": "string",
  "message": "string"
}
```

---

### Email

#### `GET /v1/notification-services/email`
Detail konfigurasi email.

#### `PUT /v1/notification-services/email/setting`
Update konfigurasi SMTP email.

#### `POST /v1/notification-services/email/send`
Kirim email.

**Payload:**
```json
{
  "to": "string",
  "subject": "string",
  "body": "string"
}
```

---

### Cron Test

#### `GET /v1/notif-cron-test`
Daftar scheduled notification test.

**Response Data:**
```json
[{
  "id": "string",
  "whatsapp_to": "string|null",
  "email_to": "string|null",
  "message": "string",
  "send_at": "string",
  "status": "string",
  "processed_at": "string|null",
  "created_at": "string",
  "updated_at": "string"
}]
```

#### `GET /v1/notif-cron-test/:id`
Detail cron test.

#### `POST /v1/notif-cron-test`
Buat scheduled notification test baru.

---

## 📌 Enum Reference

| Enum | Values |
|---|---|
| `BatchStatus` | `registration_open`, `ongoing`, `completed`, `cancelled` |
| `BatchScheduleStatus` | `scheduled`, `live`, `completed`, `cancelled`, `rescheduled` |
| `PrivateBookingStatus` | `pending`, `confirmed`, `live`, `completed`, `cancelled`, `no_show` |
| `ProgramType` | `batch`, `private` |
| `ProgramEnrollmentStatus` | `active`, `completed`, `expired`, `cancelled` |
| `SessionType` | `batch`, `private` |
| `AttendanceStatus` | `present`, `absent`, `late`, `excused` |
| `InvoiceType` | `enrollment`, `private_booking`, `other` |
| `InvoiceStatus` | `unpaid`, `partial`, `paid`, `cancelled` |
| `PaymentMethod` | `transfer`, `cash`, `midtrans`, `other` |
| `TimesheetPaymentStatus` | `unpaid`, `in_process`, `paid` |
| `CourseLevel` | `beginner`, `intermediate`, `advanced`, `all_level` |
| `CourseStatus` | `draft`, `review`, `published`, `archived` |
| `LessonType` | `video`, `article`, `pdf`, `quiz` |
| `QuestionType` | `multiple_choice`, `multiple_select`, `essay` |
| `Difficulty` | `easy`, `medium`, `hard`, `hots` |
| `ScoringSystem` | `standard`, `irt`, `raw_points` |
| `AttemptStatus` | `in_progress`, `submitted`, `graded`, `abandoned` |
| `IrtModel` | `1PL`, `2PL`, `3PL` |
| `IsActive` | `1`, `0` |
