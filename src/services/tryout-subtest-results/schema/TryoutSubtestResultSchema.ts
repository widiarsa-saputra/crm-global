import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const TryoutSubtestResultCreateSchema = z.object({
    tryout_attempt_id: z.union([z.string(), z.number()]).optional().nullable(),
    subtest_id: z.union([z.string(), z.number()]).optional().nullable(),
    total_qanswered: z.coerce.number().optional().nullable(),
    total_correct: z.coerce.number().optional().nullable(),
    total_wrong: z.coerce.number().optional().nullable(),
    total_empty: z.coerce.number().optional().nullable(),
    theta_score: z.coerce.number().optional().nullable(),
    standard_error: z.coerce.number().optional().nullable(),
    scaled_error: z.coerce.number().optional().nullable(),
    is_passed: z.boolean().optional().nullable(),
    started_at: z.string(),
    submitted_at: z.string().optional().nullable(),
    correct_score: z.coerce.number().optional().nullable(),
    wrong_score: z.coerce.number().optional().nullable(),
    empty_score: z.coerce.number().optional().nullable(),
    subtest_score: z.coerce.number(),
});

export const TryoutSubtestResultUpdateSchema = TryoutSubtestResultCreateSchema.partial();

export const TryoutSubtestResultSchemaUpdate = TryoutSubtestResultUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TryoutSubtestResultIndexSchema = z.object(nullableSchema(TryoutSubtestResultUpdateSchema)).merge(BaseEntitySchema);

export type TryoutSubtestResultCreatePayload = z.infer<typeof TryoutSubtestResultCreateSchema>;
export type TryoutSubtestResultUpdatePayload = z.infer<typeof TryoutSubtestResultUpdateSchema>;
export type TryoutSubtestResultFormUpdatePayload = z.infer<typeof TryoutSubtestResultSchemaUpdate>;
export type TryoutSubtestResultEntity = z.infer<typeof TryoutSubtestResultIndexSchema>;
