import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const RoleSchema = z.object({
    display_name: z.string(),
    name: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
    id: z.number(),
});
export const CreateRoleResponseSchema = BaseResponseSchema(RoleSchema);
export type CreateRoleResponse = z.infer<typeof CreateRoleResponseSchema>;