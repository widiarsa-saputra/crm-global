import { z } from 'zod';
import { BaseResponseSchema } from '@/services/base/response/BaseResponseSchema';

export const SingleTemplateSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    message: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const TemplateListSchema = z.array(SingleTemplateSchema);
export const IndexTemplateResponseSchema = BaseResponseSchema(TemplateListSchema);
export const SingleTemplateResponseSchema = BaseResponseSchema(SingleTemplateSchema);

export type IndexTemplateResponse = z.infer<typeof IndexTemplateResponseSchema>;
export type SingleTemplateResponse = z.infer<typeof SingleTemplateSchema>;
export type SingleTemplateResponseWrapped = z.infer<typeof SingleTemplateResponseSchema>;
