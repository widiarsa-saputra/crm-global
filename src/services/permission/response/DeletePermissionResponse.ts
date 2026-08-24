import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const PermissionSchema = z.nullable(z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    group: z.string(),
    roles: z.array(z.object({
        id: z.number(),
        display_name: z.string(),
        name: z.string(),
    })).optional(),
}).optional());
export const DeletePermissionResponseSchema = BaseResponseSchema(PermissionSchema);
export type DeletePermissionResponse = z.infer<typeof DeletePermissionResponseSchema>;