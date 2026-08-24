import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

// Skema spesifik untuk data pengguna yang dikembalikan setelah mengubah foto
const UserWithPhotoSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable(),
    phone: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    photo: z.string().nullable(),
    photo_url: z.string().url().nullable(),
});

// Skema respons akhir yang menggunakan BaseResponseSchema
export const ChangePhotoResponseSchema = BaseResponseSchema(UserWithPhotoSchema);

// Tipe data TypeScript yang di-infer dari skema
export type ChangePhotoResponse = z.infer<typeof ChangePhotoResponseSchema>;