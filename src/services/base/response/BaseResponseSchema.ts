import { z } from "zod";

// Pagination schema (optional field)
const PaginationSchema = z.object({
    current_page: z.number(),
    from: z.number().nullable().optional(), // Allow null or undefined
    to: z.number().nullable().optional(), // Allow null or undefined
    total: z.number(),
    paginate: z.number(),
    last_page: z.number(),
    next_page: z.number(),
    prev_page: z.number(),
    path: z.string(),
});

export const GeneralResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
})

export const BaseEntitySchema = z.object({
    id: z.union([z.string(), z.number()]),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
})

// Base API Response Schema
export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    GeneralResponseSchema.extend({
        data: dataSchema,
        pagination: z.nullable(PaginationSchema).optional(), // Optional pagination field
    });

export type GeneralRes = z.infer<typeof GeneralResponseSchema>;
export type BaseResponse<T> = GeneralRes & {
    data: T
}