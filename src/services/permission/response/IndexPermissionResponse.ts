import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

const PermissionRoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

export const PermissionSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    group: z.string(),
    roles: z.array(PermissionRoleSchema).optional(),
});
export const IndexPermissionResponseSchema = BaseResponseSchema(z.array(PermissionSchema));
export type IndexPermissionResponse = z.infer<typeof IndexPermissionResponseSchema>;
export type SinglePermissionResponse = z.infer<typeof PermissionSchema>;