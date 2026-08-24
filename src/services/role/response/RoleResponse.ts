import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PermissionSchema } from "@/services/permission";
import { SingleUserSchema } from "@/services/user";
import { z } from "zod";

export const RoleSchema = z.object({
    display_name: z.string(),
    name: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
    id: z.number(),
});

export const CreateRoleResponseSchema = BaseResponseSchema(RoleSchema);

export type CreateRoleResponse = z.infer<typeof CreateRoleResponseSchema>;

export const RoleSchema = z.nullable(z.object({
    id: z.number(),
    name: z.string(),
    display_name: z.string()
})).optional();

export const DeleteRoleResponseSchema = BaseResponseSchema(RoleSchema);

export type DeleteRoleResponse = z.infer<typeof DeleteRoleResponseSchema>;

export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    display_name: z.string(),
    users: z.nullable(z.array(SingleUserSchema)).optional(),
    permissions: z.nullable(z.array(PermissionSchema)).optional(),
});

export const IndexRoleResponseSchema = BaseResponseSchema(z.union([
    z.array(RoleSchema),
    RoleSchema,
]));

export type IndexRoleResponse = z.infer<typeof IndexRoleResponseSchema>;

export type RoleResponse = z.infer<typeof RoleSchema>;

export const RoleSchema = z.object({});

export const ShowRoleResponseSchema = BaseResponseSchema(RoleSchema);

export type ShowRoleResponse = z.infer<typeof ShowRoleResponseSchema>;

export const RoleSchema = z.object({});

export const UpdateRoleResponseSchema = BaseResponseSchema(RoleSchema);

export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;

