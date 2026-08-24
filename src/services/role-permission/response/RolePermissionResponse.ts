import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

export const RolePermissionSchema = z.object({});

export const CreateRolePermissionResponseSchema = BaseResponseSchema(RolePermissionSchema);

export type CreateRolePermissionResponse = z.infer<typeof CreateRolePermissionResponseSchema>;

