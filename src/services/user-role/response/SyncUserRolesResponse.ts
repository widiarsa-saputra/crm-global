import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

// Skema untuk data 'pivot' di dalam setiap role
const RolePivotSchema = z.object({
    model_type: z.string(),
    model_id: z.string(),
    role_id: z.number(),
});

// Skema untuk setiap objek 'role' di dalam array roles
const RoleInUserSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    guard_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pivot: RolePivotSchema,
});

// Skema untuk objek 'data' utama, yaitu data pengguna beserta perannya
const UserWithRolesSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable(),
    phone: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    roles: z.array(RoleInUserSchema),
});

// Skema respons akhir yang menggunakan BaseResponseSchema
export const SyncUserRolesResponseSchema = BaseResponseSchema(UserWithRolesSchema);

// Tipe data TypeScript yang di-infer dari skema
export type SyncUserRolesResponse = z.infer<typeof SyncUserRolesResponseSchema>;