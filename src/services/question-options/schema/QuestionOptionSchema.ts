import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const QuestionOptionCreateSchema = z.object({
    question_bank_id: z.union([z.string(), z.number()]).optional().nullable(),
    option_text: z.string().min(1, "Teks opsi wajib diisi"),
    is_correct: z.boolean().optional().nullable(),
    score: z.coerce.number().optional().nullable(),
    similarity_boundary: z.coerce.number().optional().nullable(),
});

export const QuestionOptionUpdateSchema = QuestionOptionCreateSchema.partial();

export const QuestionOptionSchemaUpdate = QuestionOptionUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const QuestionOptionIndexSchema = z.object(nullableSchema(QuestionOptionUpdateSchema)).merge(BaseEntitySchema);

export type QuestionOptionCreatePayload = z.infer<typeof QuestionOptionCreateSchema>;
export type QuestionOptionUpdatePayload = z.infer<typeof QuestionOptionUpdateSchema>;
export type QuestionOptionFormUpdatePayload = z.infer<typeof QuestionOptionSchemaUpdate>;
export type QuestionOptionEntity = z.infer<typeof QuestionOptionIndexSchema>;
