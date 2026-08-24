import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutQuestionIndexSchema } from "@/services/tryout-questions/schema/TryoutQuestionSchema";

export const SubtestScoringSystemEnum = ['irt', 'raw_score', 'negative_marking', 'weighted', 'graded'] as const;

export const TryoutSubtestCreateSchema = z.object({
    tryout_id: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().min(1, "Judul subtes wajib diisi"),
    order: z.coerce.number().min(0, "Urutan wajib diisi"),
    duration_minutes: z.coerce.number().min(1, "Durasi wajib diisi"),
    scoring_system: z.enum(SubtestScoringSystemEnum).default('raw_score'),
    correct_point: z.coerce.number().optional().nullable(),
    wrong_point: z.coerce.number().optional().nullable(),
    empty_point: z.coerce.number().optional().nullable(),
    passing_grade: z.coerce.number().optional().nullable(),
});

export const TryoutSubtestUpdateSchema = TryoutSubtestCreateSchema.partial();

export const TryoutSubtestSchemaUpdate = TryoutSubtestUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TryoutSubtestIndexSchema = z.object(nullableSchema(TryoutSubtestUpdateSchema)).merge(BaseEntitySchema).extend({
    total_questions: z.coerce.number().optional().nullable(),
    tryout_questions: z.array(TryoutQuestionIndexSchema).optional().nullable(),
});

export type TryoutSubtestCreatePayload = z.infer<typeof TryoutSubtestCreateSchema>;
export type TryoutSubtestUpdatePayload = z.infer<typeof TryoutSubtestUpdateSchema>;
export type TryoutSubtestFormUpdatePayload = z.infer<typeof TryoutSubtestSchemaUpdate>;
export type TryoutSubtestEntity = z.infer<typeof TryoutSubtestIndexSchema>;
