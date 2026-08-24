import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const PeriodStatusEnum = ['open_registration', 'on_going', 'completed', 'cancelled'] as const;

export const PeriodCreateSchema = z.object({
    title: z.string().min(1, "Judul period wajib diisi"),
    course_id: z.union([z.string(), z.number()]).optional().nullable(),
    curriculum_id: z.union([z.string(), z.number()]).optional().nullable(),
    tutor_id: z.union([z.string(), z.number()]).optional().nullable(),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    max_capacity: z.coerce.number().optional().nullable(),
    status: z.enum(PeriodStatusEnum).nullable(),
    has_certificate: z.coerce.boolean().optional().nullable(),
});

export const PeriodUpdateSchema = PeriodCreateSchema.partial();

export const PeriodSchemaUpdate = PeriodUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const PeriodIndexSchema = z.object(nullableSchema(PeriodUpdateSchema)).merge(BaseEntitySchema).extend({
    course_name: z.string().optional().nullable(),
    curriculum_title: z.string().optional().nullable(),
    tutor_name: z.string().optional().nullable(),
    total_sections: z.number().optional().nullable(),
    total_course: z.number().optional().nullable(),
    course: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    curriculum: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    tutor: z.object({ name: z.string().optional().nullable() }).optional().nullable(),
});

export type PeriodCreatePayload = z.infer<typeof PeriodCreateSchema>;
export type PeriodUpdatePayload = z.infer<typeof PeriodUpdateSchema>;
export type PeriodFormUpdatePayload = z.infer<typeof PeriodSchemaUpdate>;
export type PeriodEntity = z.infer<typeof PeriodIndexSchema>;
