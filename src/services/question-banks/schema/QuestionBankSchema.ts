import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { QuestionOptionIndexSchema } from "@/services/question-options/schema/QuestionOptionSchema";

export const QuestionTypeEnum = ['multiple_choice', 'polytomous', 'short_answer', 'multiple_select'] as const;
export const DifficultyEnum = ['easy', 'medium', 'hard', 'hots'] as const;

export const QuestionBankCreateSchema = z.object({
    lesson_id: z.union([z.string(), z.number()]).optional().nullable(),
    question_type: z.enum(QuestionTypeEnum),
    difficulty: z.enum(DifficultyEnum),
    question_text: z.string().min(1, "Teks soal wajib diisi"),
    question_image_url: z.string().optional().nullable(),
    explanation: z.string().optional().nullable(),
    item_discrimination_a: z.coerce.number().optional().nullable(),
    item_difficulty_b: z.coerce.number().optional().nullable(),
    item_guessing_c: z.coerce.number().optional().nullable(),
    total_tested_attempts: z.coerce.number().optional().nullable(),
    last_calibrated_at: z.string().optional().nullable(),
});

export const QuestionBankUpdateSchema = QuestionBankCreateSchema.partial();

export const QuestionBankSchemaUpdate = QuestionBankUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

// QuestionOption inline schema (for IndexSchema relation)
export const QuestionOptionInlineSchema = z.object({
    id: z.union([z.string(), z.number()]),
    option_text: z.string().optional().nullable(),
    is_correct: z.boolean().optional().nullable(),
    score: z.coerce.number().optional().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const QuestionBankIndexSchema = z.object(nullableSchema(QuestionBankUpdateSchema)).merge(BaseEntitySchema).extend({
    created_by: z.union([z.string(), z.number()]).optional().nullable(),
    question_options: z.array(QuestionOptionIndexSchema).optional().nullable(),
});

export type QuestionBankCreatePayload = z.infer<typeof QuestionBankCreateSchema>;
export type QuestionBankUpdatePayload = z.infer<typeof QuestionBankUpdateSchema>;
export type QuestionBankFormUpdatePayload = z.infer<typeof QuestionBankSchemaUpdate>;
export type QuestionBankEntity = z.infer<typeof QuestionBankIndexSchema>;
export type QuestionOptionInline = z.infer<typeof QuestionOptionInlineSchema>;
