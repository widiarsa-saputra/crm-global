import { z } from "zod";

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
