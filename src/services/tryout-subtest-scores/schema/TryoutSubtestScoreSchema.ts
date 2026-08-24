import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const SubtestBreakdownSchema = z.object({
    subtest_id: z.union([z.string(), z.number()]).optional().nullable(),
    subtest_name: z.string().optional().nullable(),
    raw_correct: z.number().optional().nullable(),
    total_questions: z.number().optional().nullable(),
    theta_score: z.number().optional().nullable(),
    scaled_score: z.number().optional().nullable(),
    passing_grade_target: z.number().optional().nullable(),
    status: z.string().optional().nullable(),
});

export const TryoutSubtestScoreIndexSchema = z.object({
    tryout_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_name: z.string().optional().nullable(),
    rank: z.number().optional().nullable(),
    percentile: z.number().optional().nullable(),
    average_scaled_score: z.number().optional().nullable(),
    subtest_breakdown: z.array(SubtestBreakdownSchema).optional().nullable(),
}).merge(BaseEntitySchema);

export type SubtestBreakdown = z.infer<typeof SubtestBreakdownSchema>;
export type TryoutSubtestScoreEntity = z.infer<typeof TryoutSubtestScoreIndexSchema>;
