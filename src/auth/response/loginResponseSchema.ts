import { z } from "zod";

const roleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

const permissionSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    group: z.string(),
});

const loginDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    email_verified_at: z.string().nullable().optional(), // bisa null atau tidak ada
    channex_user_api_key: z.string().optional(), // optional kalau ga selalu ada
    username: z.string().optional(), // optional kalau ga selalu ada
    roles: z.array(roleSchema),
    permissions: z.array(permissionSchema),
    active_property: z.string().optional(),
    active_property_id: z.string().optional(),
    properties: z.record(z.any()).optional(),
    photo_url: z.string().nullable().optional(),
});

const loginResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    token: z.string(),
    expired: z.string(),
    data: loginDataSchema,
});

export default loginResponseSchema;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginData = z.infer<typeof loginDataSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Permission = z.infer<typeof permissionSchema>;
