import { z } from 'zod';
import { optionalMinString } from '@/lib/zod';

export const CreateTemplateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
});

export const UpdateTemplateSchema = z.object({
    name: optionalMinString(1, "Name is required"),
    message: optionalMinString(1, "Message is required"),
});

export type CreateTemplatePayload = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplatePayload = z.infer<typeof UpdateTemplateSchema>;
