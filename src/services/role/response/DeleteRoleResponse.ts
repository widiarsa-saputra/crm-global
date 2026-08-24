import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const RoleSchema = z.nullable(z.object({
    id: z.number(),
    name: z.string(),
    display_name: z.string()
})).optional();

export const DeleteRoleResponseSchema = BaseResponseSchema(RoleSchema);
export type DeleteRoleResponse = z.infer<typeof DeleteRoleResponseSchema>;