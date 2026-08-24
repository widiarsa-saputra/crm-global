import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const SingleFileSchema = z.object({
    id: z.string(),
    folder_id: z.number().nullable().optional(),
    user_id: z.string(),
    visibility: z.enum(["public", "private"]).optional(),
    title: z.string().nullable().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    size: z.number(),
    mime_type: z.string(),
    ext: z.string(),
    url: z.string(),
    is_compressed: z.boolean().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable().optional(),
    size_for_human: z.string().optional(),
    // Relations
    folder: z.any().optional(),
    file_items: z.array(z.any()).optional(),
    posts: z.array(z.any()).optional(),
});

export const FileSchema = z.array(SingleFileSchema);
export const IndexFileResponseSchema = BaseResponseSchema(FileSchema);
export type IndexFileResponse = z.infer<typeof IndexFileResponseSchema>;
export type SingleFileResponse = z.infer<typeof SingleFileSchema>;
