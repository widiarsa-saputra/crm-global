import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const PermissionSchema = z.object({
    guard_name: z.string(),
    display_name: z.string(),
    group: z.string(),
    name: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
    id: z.string(),
});
export const CreatePermissionResponseSchema = BaseResponseSchema(PermissionSchema);
export type CreatePermissionResponse = z.infer<typeof CreatePermissionResponseSchema>;