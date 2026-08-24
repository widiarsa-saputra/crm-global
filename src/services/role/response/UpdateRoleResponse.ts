import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const RoleSchema = z.object({});
export const UpdateRoleResponseSchema = BaseResponseSchema(RoleSchema);
export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;