import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const RoleSchema = z.object({});
export const ShowRoleResponseSchema = BaseResponseSchema(RoleSchema);
export type ShowRoleResponse = z.infer<typeof ShowRoleResponseSchema>;