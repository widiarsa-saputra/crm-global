import { BaseResponseSchema, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

export const UserObjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const JobListObjectSchema = z.object({
    id: z.number(),
    triggered_by: z.string(),
    status: z.string(),
    total_contacts: z.number(),
    processed_contacts: z.number(),
    started_at: z.string().nullable().optional(),
    completed_at: z.string().nullable().optional(),
    error_message: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    user: UserObjectSchema.optional().nullable(),
});

export type JobList = z.infer<typeof JobListObjectSchema>;



export const IndexJobListResponseSchema = BaseResponseSchema(z.array(JobListObjectSchema));
export type IndexJobListResponse = z.infer<typeof IndexJobListResponseSchema>;


export const DeleteJobListResponseSchema = GeneralResponseSchema;
export type DeleteJobListResponse = z.infer<typeof DeleteJobListResponseSchema>;
