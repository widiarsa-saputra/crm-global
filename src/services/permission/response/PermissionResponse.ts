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

export const CreatePermissionResponseSchema = BaseResponseSchema(PermissionSchema);

export type CreatePermissionResponse = z.infer<typeof CreatePermissionResponseSchema>;

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

export const PermissionSchema = z.object({});

export const ShowPermissionResponseSchema = BaseResponseSchema(PermissionSchema);

export type ShowPermissionResponse = z.infer<typeof ShowPermissionResponseSchema>;

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

