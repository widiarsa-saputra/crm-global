import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const PermissionSchema = z.object({
    id: z.string(),
    display_name: z.string(),
    name: z.string(),
    group: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    guard_name: z.string(),
});
export const UpdatePermissionResponseSchema = BaseResponseSchema(PermissionSchema);
export type UpdatePermissionResponse = z.infer<typeof UpdatePermissionResponseSchema>;