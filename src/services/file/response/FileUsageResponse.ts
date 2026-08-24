import { z } from "zod";

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
