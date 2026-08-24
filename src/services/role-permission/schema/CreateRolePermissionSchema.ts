import { z } from "zod";

const CreateRolePermissionSchema = z.object({
    permissions: z.nullable(z.array(z.string()).min(1, "At least one permission is required")),
    role: z.string().min(1, "Role is required"),
});

export { CreateRolePermissionSchema };
export type CreateRolePermission = z.infer<typeof CreateRolePermissionSchema>;