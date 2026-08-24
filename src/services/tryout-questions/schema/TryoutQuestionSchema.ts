import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { QuestionBankIndexSchema } from "@/services/question-banks/schema/QuestionBankSchema";

export const CalibrationSourceEnum = ['pre_calibrated', 'post_hoc'] as const;

export const TryoutQuestionCreateSchema = z.object({
    subtest_id: z.union([z.string(), z.number()]).optional().nullable(),
    question_bank_id: z.union([z.string(), z.number()]).optional().nullable(),
    order: z.coerce.number().min(0, "Urutan wajib diisi"),
    weight_point: z.coerce.number().optional().nullable(),
    item_discrimination_a: z.coerce.number().optional().nullable(),
    item_difficulty_b: z.coerce.number().optional().nullable(),
    item_guessing_c: z.coerce.number().optional().nullable(),
    calibration_source: z.enum(CalibrationSourceEnum).optional().nullable(),
    calibrated_at: z.string().optional().nullable(),
});

export const TryoutQuestionUpdateSchema = TryoutQuestionCreateSchema.partial();

export const TryoutQuestionSchemaUpdate = TryoutQuestionUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TryoutQuestionIndexSchema = z.object(nullableSchema(TryoutQuestionUpdateSchema)).merge(BaseEntitySchema).extend({
    question_bank: QuestionBankIndexSchema.optional().nullable(),
});

export type TryoutQuestionCreatePayload = z.infer<typeof TryoutQuestionCreateSchema>;
export type TryoutQuestionUpdatePayload = z.infer<typeof TryoutQuestionUpdateSchema>;
export type TryoutQuestionFormUpdatePayload = z.infer<typeof TryoutQuestionSchemaUpdate>;
export type TryoutQuestionEntity = z.infer<typeof TryoutQuestionIndexSchema>;
