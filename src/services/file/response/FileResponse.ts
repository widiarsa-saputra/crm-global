import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

export const DeleteFileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
});

export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;

export const FileStatisticsSchema = z.object({
    total_files: z.number(),
    usage_limit: z.number(),
    usage_limit_mb: z.number(),
    usage_limit_formatted: z.string(),
    current_usage: z.number(),
    current_usage_formatted: z.string(),
    current_usage_mb: z.number(),
    usage_percentage: z.number(),
    remaining_space: z.number(),
    remaining_space_formatted: z.string(),
    remaining_space_mb: z.number(),
    is_over_limit: z.boolean(),
    files_by_type: z.array(z.any()),
    files_by_extension: z.array(z.any()),
    storage_usage: z.array(z.any()),
    recent_uploads: z.array(z.any()),
    large_files: z.array(z.any()),
    scope: z.string(),
    user_id: z.string().nullable().optional(),
});

export const FileStatisticsResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: FileStatisticsSchema,
});

export type FileStatistics = z.infer<typeof FileStatisticsSchema>;

export type FileStatisticsResponse = z.infer<typeof FileStatisticsResponseSchema>;

export const FileUsageSchema = z.object({
    usage_limit: z.number(),
    usage_limit_mb: z.number(),
    usage_limit_formatted: z.string(),
    current_usage: z.number(),
    current_usage_formatted: z.string(),
    current_usage_mb: z.number(),
    usage_percentage: z.number(),
    remaining_space: z.number(),
    remaining_space_formatted: z.string(),
    remaining_space_mb: z.number(),
    is_over_limit: z.boolean(),
    scope: z.string(),
    user_id: z.string().nullable().optional(),
});

export const FileUsageResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: FileUsageSchema,
});

export type FileUsage = z.infer<typeof FileUsageSchema>;

export type FileUsageResponse = z.infer<typeof FileUsageResponseSchema>;

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

export const UpdateFileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: SingleFileSchema,
});

export type UpdateFileResponse = z.infer<typeof UpdateFileResponseSchema>;

export const UploadFileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: SingleFileSchema,
});

export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;

