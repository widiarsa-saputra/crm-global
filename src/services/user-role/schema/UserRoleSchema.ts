import { z } from "zod";

const CreateUserRoleSchema = z.object({
    user_ids: z.array(z.string()).nonempty("User IDs are required"),
    role: z.nullable(z.string().min(1, "Role is required")).optional(),
});

export { CreateUserRoleSchema };

export type CreateUserRole = z.infer<typeof CreateUserRoleSchema>;

export const SyncUserRolesSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    // Mengubah dari z.array(z.number()) menjadi z.array(z.string())
    roles: z.array(z.string()).optional(), // Array of role names
});

export type SyncUserRoles = z.infer<typeof SyncUserRolesSchema>;

