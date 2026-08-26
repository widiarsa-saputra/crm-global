import { BaseResponseSchema, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

export const RoleSchema = z.object({
    display_name: z.string(),
    name: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
    id: z.number(),
    users: z.array(z.any()).nullable().optional(),
    permissions: z.array(z.any()).nullable().optional(),
});


export type CreateRoleResponse = z.infer<typeof CreateRoleResponseSchema>;

export type DeleteRoleResponse = z.infer<typeof DeleteRoleResponseSchema>;
export const IndexRoleResponseSchema = BaseResponseSchema(z.union([
    z.array(RoleSchema),
    RoleSchema,
]));

export type IndexRoleResponse = z.infer<typeof IndexRoleResponseSchema>;

export type RoleResponse = z.infer<typeof RoleSchema>;

export type ShowRoleResponse = z.infer<typeof ShowRoleResponseSchema>;

export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;


export const CreateRoleResponseSchema = BaseResponseSchema(RoleSchema);

export const DeleteRoleResponseSchema = GeneralResponseSchema;

export const ShowRoleResponseSchema = BaseResponseSchema(RoleSchema);

export const UpdateRoleResponseSchema = BaseResponseSchema(RoleSchema);
