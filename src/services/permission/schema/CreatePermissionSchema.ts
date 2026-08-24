import { z } from "zod";

const CreatePermissionSchema = z.object({
    display_name: z.string().min(1, "Display name is required"),
    group: z.string().min(1, "Group is required"),
    name: z.string().min(1, "Name is required"),
});

export { CreatePermissionSchema };
export type CreatePermission = z.infer<typeof CreatePermissionSchema>;