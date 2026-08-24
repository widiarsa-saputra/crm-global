import { z } from "zod";

const CreateRoleSchema = z.object({
    display_name: z.string().min(1, "Display name is required"),
    name: z.string().min(1, "Name is required"),
});

export { CreateRoleSchema };
export type CreateRole = z.infer<typeof CreateRoleSchema>;