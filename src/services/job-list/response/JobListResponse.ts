import { z } from "zod";

export const JobListObjectSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    status: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type JobList = z.infer<typeof JobListObjectSchema>;

const BaseResponseSchema = z.object({
    message: z.string(),
    statusCode: z.number(),
});


export const IndexJobListResponseSchema = BaseResponseSchema.extend({
    data: z.array(JobListObjectSchema),
    pagination: z.object({
        total: z.number(),
        count: z.number(),
        per_page: z.number(),
        current_page: z.number(),
        total_pages: z.number(),
    }).optional(),
});
export type IndexJobListResponse = z.infer<typeof IndexJobListResponseSchema>;


export const DeleteJobListResponseSchema = BaseResponseSchema.extend({
    data: z.object({
        id: z.number(),
    }).optional(),
});
export type DeleteJobListResponse = z.infer<typeof DeleteJobListResponseSchema>;
