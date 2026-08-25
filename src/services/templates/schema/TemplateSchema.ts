import { z } from 'zod';

export const CreateTemplateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
});

export const UpdateTemplateSchema = CreateTemplateSchema.partial();

export type CreateTemplatePayload = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplatePayload = z.infer<typeof UpdateTemplateSchema>;
