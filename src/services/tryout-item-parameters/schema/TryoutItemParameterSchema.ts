import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const IrtModelEnum = ['1PL', '2PL', '3PL'] as const;

export const TryoutItemParameterIndexSchema = z.object({
    question_id: z.union([z.string(), z.number()]).optional().nullable(),
    subtest_id: z.union([z.string(), z.number()]).optional().nullable(),
    question_number: z.number().optional().nullable(),
    difficulty_b: z.number().optional().nullable(),
    difficulty_label: z.string().optional().nullable(),
    discrimination_a: z.number().optional().nullable(),
    guessing_c: z.number().optional().nullable(),
    correct_count: z.number().optional().nullable(),
    total_responses: z.number().optional().nullable(),
    correct_rate_percentage: z.number().optional().nullable(),
}).merge(BaseEntitySchema);

export const IrtCalculateSchema = z.object({
    model: z.enum(IrtModelEnum).default('3PL'),
    tryout_id: z.union([z.string(), z.number()]).optional().nullable(),
    subtest_ids: z.array(z.union([z.string(), z.number()])).optional(),
});

export type TryoutItemParameterEntity = z.infer<typeof TryoutItemParameterIndexSchema>;
export type IrtCalculatePayload = z.infer<typeof IrtCalculateSchema>;
export type IrtModelType = typeof IrtModelEnum[number];
