import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const EnrollmentTypeEnum = ['private', 'group', 'period', 'self_learn'] as const;

export const EnrollmentCreateSchema = z.object({
    course_id: z.union([z.string(), z.number()]).optional().nullable(),
    student_id: z.union([z.string(), z.number()]).optional().nullable(),
    period_enrollment_id: z.union([z.string(), z.number()]).optional().nullable(),
    enrollment_group_id: z.union([z.string(), z.number()]).optional().nullable(),
    curriculum_id: z.union([z.string(), z.number()]).optional().nullable(),
    total_sessions: z.coerce.number().optional().nullable(),
    status: z.string().optional().nullable(),
    reason: z.string().optional().nullable(),
    type: z.enum(EnrollmentTypeEnum),
});

export const EnrollmentUpdateSchema = EnrollmentCreateSchema.partial();

export const EnrollmentSchemaUpdate = EnrollmentUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const EnrollmentIndexSchema = z.object(nullableSchema(EnrollmentUpdateSchema)).merge(BaseEntitySchema).extend({
    expired_at: z.string().optional().nullable(),
    used_sessions: z.number().optional().nullable(),
    certificate_expired_at: z.string().optional().nullable(),
    progress: z.number().optional().nullable(),
    course: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    student: z.object({ name: z.string().optional().nullable() }).optional().nullable(),
    period_enrollment: z.object({ id: z.union([z.string(), z.number()]).optional().nullable() }).optional().nullable(),
    enrollment_group: z.object({ name: z.string().optional().nullable() }).optional().nullable(),
    curriculum: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
});

export type EnrollmentCreatePayload = z.infer<typeof EnrollmentCreateSchema>;
export type EnrollmentUpdatePayload = z.infer<typeof EnrollmentUpdateSchema>;
export type EnrollmentFormUpdatePayload = z.infer<typeof EnrollmentSchemaUpdate>;
export type EnrollmentEntity = z.infer<typeof EnrollmentIndexSchema>;
