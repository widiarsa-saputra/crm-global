import { z } from "zod";

const UpdateRoleSchema = z.object({
    display_name: z.string().min(1, "Display name is required").optional()
});

export { UpdateRoleSchema };
export type UpdateRole = z.infer<typeof UpdateRoleSchema>;