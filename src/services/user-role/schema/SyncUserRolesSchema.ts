import { z } from "zod";

export const SyncUserRolesSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    // Mengubah dari z.array(z.number()) menjadi z.array(z.string())
    roles: z.array(z.string()).optional(), // Array of role names
});

export type SyncUserRoles = z.infer<typeof SyncUserRolesSchema>;