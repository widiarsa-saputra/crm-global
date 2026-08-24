import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const PeriodEnrollmentCreateSchema = z.object({
    period_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_id: z.union([z.string(), z.number()]).optional().nullable(),
    curriculum_id: z.union([z.string(), z.number()]).optional().nullable(),
});

export const PeriodEnrollmentUpdateSchema = PeriodEnrollmentCreateSchema.partial();

export const PeriodEnrollmentSchemaUpdate = PeriodEnrollmentUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const PeriodEnrollmentIndexSchema = z.object(nullableSchema(PeriodEnrollmentUpdateSchema)).merge(BaseEntitySchema).extend({
    period_title: z.string().optional().nullable(),
    student_name: z.string().optional().nullable(),
    curriculum_title: z.string().optional().nullable(),
    period: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    student: z.object({ name: z.string().optional().nullable() }).optional().nullable(),
    curriculum: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    creator: z.object({ name: z.string() }).optional().nullable(),
});

export type PeriodEnrollmentCreatePayload = z.infer<typeof PeriodEnrollmentCreateSchema>;
export type PeriodEnrollmentUpdatePayload = z.infer<typeof PeriodEnrollmentUpdateSchema>;
export type PeriodEnrollmentFormUpdatePayload = z.infer<typeof PeriodEnrollmentSchemaUpdate>;
export type PeriodEnrollmentEntity = z.infer<typeof PeriodEnrollmentIndexSchema>;
