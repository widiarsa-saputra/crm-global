import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const TutoringSessionStatusEnum = ['pending', 'approved', 'reschedule', 'cancelled'] as const;

export const TutoringSessionCreateSchema = z.object({
    enrollment_group_id: z.union([z.string(), z.number()]).optional().nullable(),
    enrollment_id: z.union([z.string(), z.number()]).optional().nullable(),
    tutor_id: z.union([z.string(), z.number()]).optional().nullable(),
    start_time: z.string().optional().nullable(),
    duration: z.coerce.number().optional().nullable(),
    estimated_complete_time: z.string().optional().nullable(),
    results: z.string().optional().nullable(),
    status: z.enum(TutoringSessionStatusEnum).optional().nullable(),
});

export const TutoringSessionUpdateSchema = TutoringSessionCreateSchema.partial();

export const TutoringSessionSchemaUpdate = TutoringSessionUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TutoringSessionIndexSchema = z.object(nullableSchema(TutoringSessionUpdateSchema)).merge(BaseEntitySchema).extend({
    enrollment_group_name: z.string().optional().nullable(),
    enrollment_student_name: z.string().optional().nullable(),
    tutor_name: z.string().optional().nullable(),
    enrollment_group: z.object({ name: z.string().optional().nullable() }).optional().nullable(),
    enrollment: z.object({ student: z.object({ name: z.string().optional().nullable() }).optional().nullable() }).optional().nullable(),
    tutor: z.object({ name: z.string().optional().nullable() }).optional().nullable(),
});

export type TutoringSessionCreatePayload = z.infer<typeof TutoringSessionCreateSchema>;
export type TutoringSessionUpdatePayload = z.infer<typeof TutoringSessionUpdateSchema>;
export type TutoringSessionFormUpdatePayload = z.infer<typeof TutoringSessionSchemaUpdate>;
export type TutoringSessionEntity = z.infer<typeof TutoringSessionIndexSchema>;
