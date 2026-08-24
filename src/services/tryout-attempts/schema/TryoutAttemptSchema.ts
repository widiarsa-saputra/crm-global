import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const AttemptStatusEnum = ['in_progress', 'completed', 'abandoned'] as const;

export const TryoutAttemptCreateSchema = z.object({
    tryout_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_id: z.union([z.string(), z.number()]).optional().nullable(),
    tryout_title: z.string().optional().nullable(),
    student_name: z.string().optional().nullable(),
    total_score: z.coerce.number().optional().nullable(),
    status: z.enum(AttemptStatusEnum),
    started_at: z.string().optional().nullable(),
    submitted_at: z.string().optional().nullable(),
    total_correct_score: z.coerce.number().optional().nullable(),
    total_wrong_score: z.coerce.number().optional().nullable(),
    total_empty_score: z.coerce.number().optional().nullable(),
});

export const TryoutAttemptUpdateSchema = TryoutAttemptCreateSchema.partial();

export const TryoutAttemptSchemaUpdate = TryoutAttemptUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TryoutAttemptIndexSchema = z.object(nullableSchema(TryoutAttemptUpdateSchema)).merge(BaseEntitySchema);

export type TryoutAttemptCreatePayload = z.infer<typeof TryoutAttemptCreateSchema>;
export type TryoutAttemptUpdatePayload = z.infer<typeof TryoutAttemptUpdateSchema>;
export type TryoutAttemptFormUpdatePayload = z.infer<typeof TryoutAttemptSchemaUpdate>;
export type TryoutAttemptEntity = z.infer<typeof TryoutAttemptIndexSchema>;
