import { z } from "zod";

const UpdatePermissionSchema = z.object({
    display_name: z.string().min(1, "Display name is required").optional(),
    group: z.string().min(1, "Group is required").optional(),
});

export { UpdatePermissionSchema };
export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>;