import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

// Define user role schema
const RoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

// Define permission schema
const PermissionSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    group: z.string(),
});

// Define user schema
const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    roles: z.array(RoleSchema).optional(),
    permissions: z.array(PermissionSchema).optional(),
    photo_url: z.string().nullable().optional(),
});

// Apply the base schema for a single user response
export const GetUserLoginResponseSchema = BaseResponseSchema(UserSchema);
export type GetUserLoginResponse = z.infer<typeof GetUserLoginResponseSchema>;

// Schema without base response
export const GetUserLoginResponseSchemaWithoutBase = UserSchema;
export type GetUserLoginResponseWithoutBase = z.infer<typeof GetUserLoginResponseSchemaWithoutBase>;