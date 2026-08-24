import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleUserSchema } from "@/services/user";
import { z } from "zod";

export const UserRoleSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display name is required"),
    users: z.array(SingleUserSchema).optional(),
});

export const CreateUserRoleResponseSchema = BaseResponseSchema(UserRoleSchema);

export type CreateUserRoleResponse = z.infer<typeof CreateUserRoleResponseSchema>;

const RolePivotSchema = z.object({
    model_type: z.string(),
    model_id: z.string(),
    role_id: z.number(),
});

const RoleInUserSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    guard_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pivot: RolePivotSchema,
});

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

export const SyncUserRolesResponseSchema = BaseResponseSchema(UserWithRolesSchema);

export type SyncUserRolesResponse = z.infer<typeof SyncUserRolesResponseSchema>;

