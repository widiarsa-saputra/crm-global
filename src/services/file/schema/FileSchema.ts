import { z } from "zod";

const UpdateFileSchema = z.object({
    user_id: z.number().optional(),
    title: z.string().max(255).optional(),
    description: z.string().max(500).optional().nullable(),
    visibility: z.enum(["public", "private"]).optional(),
});

export { UpdateFileSchema };

export type UpdateFile = z.infer<typeof UpdateFileSchema>;

const UploadFileSchema = z.object({
    file: z.instanceof(File),
    folder_id: z.number().optional(),
    user_id: z.number().optional(),
    is_compressed: z.boolean().optional().nullable(),
    title: z.string().max(255).optional(),
    description: z.string().max(500).optional().nullable(),
});

export { UploadFileSchema };

export type UploadFile = z.infer<typeof UploadFileSchema>;

