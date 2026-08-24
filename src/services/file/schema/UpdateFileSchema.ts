import { z } from "zod";

const UpdateFileSchema = z.object({
    user_id: z.number().optional(),
    title: z.string().max(255).optional(),
    description: z.string().max(500).optional().nullable(),
    visibility: z.enum(["public", "private"]).optional(),
});

export { UpdateFileSchema };
export type UpdateFile = z.infer<typeof UpdateFileSchema>;
