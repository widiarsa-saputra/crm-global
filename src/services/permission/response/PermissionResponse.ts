import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

export const PermissionSchema = z.object({
    guard_name: z.string(),
    display_name: z.string(),
    group: z.string(),
    name: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
    id: z.string(),
});


export type CreatePermissionResponse = z.infer<typeof CreatePermissionResponseSchema>;

export type DeletePermissionResponse = z.infer<typeof DeletePermissionResponseSchema>;


export const IndexPermissionResponseSchema = BaseResponseSchema(z.array(PermissionSchema));

export type IndexPermissionResponse = z.infer<typeof IndexPermissionResponseSchema>;

export type SinglePermissionResponse = z.infer<typeof PermissionSchema>;

export type ShowPermissionResponse = z.infer<typeof ShowPermissionResponseSchema>;

export type UpdatePermissionResponse = z.infer<typeof UpdatePermissionResponseSchema>;


export const CreatePermissionResponseSchema = BaseResponseSchema(PermissionSchema);

export const DeletePermissionResponseSchema = BaseResponseSchema(PermissionSchema);

export const ShowPermissionResponseSchema = BaseResponseSchema(PermissionSchema);

export const UpdatePermissionResponseSchema = BaseResponseSchema(PermissionSchema);
