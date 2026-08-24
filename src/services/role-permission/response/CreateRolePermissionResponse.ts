import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const RolePermissionSchema = z.object({});
export const CreateRolePermissionResponseSchema = BaseResponseSchema(RolePermissionSchema);
export type CreateRolePermissionResponse = z.infer<typeof CreateRolePermissionResponseSchema>;