import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleUserSchema } from "@/services/user/response/IndexUserResponse";
import { PermissionSchema } from "@/services/permission/response/IndexPermissionResponse";

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