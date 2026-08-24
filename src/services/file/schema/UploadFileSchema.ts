import { z } from "zod";

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
