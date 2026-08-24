import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

// Payload untuk trigger kalkulasi progress bulanan
export const StudentProgressCalculateSchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2020),
});

export type StudentProgressCalculatePayload = z.infer<typeof StudentProgressCalculateSchema>;

// Schema untuk 1 record progress bulanan per siswa (list/index)
export const StudentMonthlyProgressIndexSchema = z.object({
    student_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_name: z.string().optional().nullable(),
    parent_name: z.string().optional().nullable(),
    period_year: z.number().optional().nullable(),
    period_month: z.number().optional().nullable(),
    period_label: z.string().optional().nullable(),

    // Kehadiran
    sessions_attended: z.number().optional().nullable(),
    sessions_total: z.number().optional().nullable(),
    attendance_rate: z.number().optional().nullable(),

    // CBT / Tryout
    tryouts_completed: z.number().optional().nullable(),
    avg_scaled_score: z.number().optional().nullable(),
    best_scaled_score: z.number().optional().nullable(),
    avg_rank_in_batch: z.number().optional().nullable(),

    // Lesson completion
    lessons_completed: z.number().optional().nullable(),
    lessons_total: z.number().optional().nullable(),
    lesson_completion_rate: z.number().optional().nullable(),

    calculated_at: z.string().optional().nullable(),
}).merge(BaseEntitySchema);

// Schema untuk detail 1 siswa — berisi array snapshot bulanan untuk trend chart
export const StudentProgressTrendItemSchema = z.object({
    period_label: z.string().optional().nullable(),
    period_year: z.number().optional().nullable(),
    period_month: z.number().optional().nullable(),
    attendance_rate: z.number().optional().nullable(),
    avg_scaled_score: z.number().optional().nullable(),
    lesson_completion_rate: z.number().optional().nullable(),
    tryouts_completed: z.number().optional().nullable(),
});

export const StudentProgressDetailSchema = z.object({
    student_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_name: z.string().optional().nullable(),
    parent_name: z.string().optional().nullable(),
    latest: StudentMonthlyProgressIndexSchema.optional().nullable(),
    trend: z.array(StudentProgressTrendItemSchema).optional().nullable(),
}).merge(BaseEntitySchema);

export type StudentMonthlyProgressEntity = z.infer<typeof StudentMonthlyProgressIndexSchema>;
export type StudentProgressTrendItem = z.infer<typeof StudentProgressTrendItemSchema>;
export type StudentProgressDetailEntity = z.infer<typeof StudentProgressDetailSchema>;
