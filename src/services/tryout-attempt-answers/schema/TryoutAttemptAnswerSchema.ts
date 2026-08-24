import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const GradingStatusEnum = ['auto_graded', 'pending_review', 'graded'] as const;

export const TryoutAttemptAnswerCreateSchema = z.object({
    tryout_attempt_id: z.union([z.string(), z.number()]).optional().nullable(),
    tryout_question_id: z.union([z.string(), z.number()]).optional().nullable(),
    question_option_id: z.union([z.string(), z.number()]).optional().nullable(),
    is_correct: z.boolean().optional().nullable(),
    score_earned: z.coerce.number().optional().nullable(),
    response_time_seconds: z.coerce.number().optional().nullable(),
    is_flagged: z.boolean().default(false),
    essay_answer_text: z.string().optional().nullable(),
    grading_status: z.enum(GradingStatusEnum).optional().nullable(),
});

export const TryoutAttemptAnswerUpdateSchema = TryoutAttemptAnswerCreateSchema.partial();

export const TryoutAttemptAnswerSchemaUpdate = TryoutAttemptAnswerUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TryoutAttemptAnswerIndexSchema = z.object(nullableSchema(TryoutAttemptAnswerUpdateSchema)).merge(BaseEntitySchema);

export type TryoutAttemptAnswerCreatePayload = z.infer<typeof TryoutAttemptAnswerCreateSchema>;
export type TryoutAttemptAnswerUpdatePayload = z.infer<typeof TryoutAttemptAnswerUpdateSchema>;
export type TryoutAttemptAnswerFormUpdatePayload = z.infer<typeof TryoutAttemptAnswerSchemaUpdate>;
export type TryoutAttemptAnswerEntity = z.infer<typeof TryoutAttemptAnswerIndexSchema>;
