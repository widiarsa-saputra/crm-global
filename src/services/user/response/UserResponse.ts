import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PermissionSchema } from "@/services/permission";
import { z } from "zod";

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    id: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
});

export const CreateUserResponseSchema = BaseResponseSchema(UserSchema);

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export const UserSchema = z.nullable(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string()
})).optional();

export const DeleteUserResponseSchema = BaseResponseSchema(UserSchema);

export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;

const UserRoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

export const SingleUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phone: z.string().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    roles: z.array(UserRoleSchema).optional(),
    permissions: z.array(PermissionSchema).optional()
});

export const UserSchema = z.array(SingleUserSchema);

export const IndexUserResponseSchema = BaseResponseSchema(UserSchema);

export type IndexUserResponse = z.infer<typeof IndexUserResponseSchema>;

export type SingleUserResponse = z.infer<typeof SingleUserSchema>;

export const UserSchema = z.object({});

export const ShowUserResponseSchema = BaseResponseSchema(UserSchema);

export type ShowUserResponse = z.infer<typeof ShowUserResponseSchema>;

export const UserSchema = z.object({});

export const UpdateUserResponseSchema = BaseResponseSchema(UserSchema);

export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

