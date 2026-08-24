import { z } from "zod";

const CreateUserRoleSchema = z.object({
    user_ids: z.array(z.string()).nonempty("User IDs are required"),
    role: z.nullable(z.string().min(1, "Role is required")).optional(),
});

export { CreateUserRoleSchema };
export type CreateUserRole = z.infer<typeof CreateUserRoleSchema>;