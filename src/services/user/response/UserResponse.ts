import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PermissionSchema } from "@/services/permission";
import { z } from "zod";


export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;

const UserRoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phone: z.string().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    roles: z.array(UserRoleSchema).optional(),
    permissions: z.array(PermissionSchema).optional()
});

export type IndexUserResponse = z.infer<typeof IndexUserResponseSchema>;

export type SingleUserResponse = z.infer<typeof UserSchema>;

export type ShowUserResponse = z.infer<typeof ShowUserResponseSchema>;

export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;


export const CreateUserResponseSchema = BaseResponseSchema(UserSchema);

export const DeleteUserResponseSchema = BaseResponseSchema(UserSchema);

export const IndexUserResponseSchema = BaseResponseSchema(z.array(UserSchema));

export const ShowUserResponseSchema = BaseResponseSchema(UserSchema);

export const UpdateUserResponseSchema = BaseResponseSchema(UserSchema);
