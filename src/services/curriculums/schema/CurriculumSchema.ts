import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { CurriculumCourseNestedSchema } from "@/services/curriculum-courses/schema/CurriculumCourseSchema";

export const CurriculumCreateSchema = z.object({
    tryout_id: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().min(1, "Judul curriculum wajib diisi"),
    description: z.string().optional().nullable(),
    duration: z.coerce.number().optional().nullable(),
    curriculum_courses: z.array(CurriculumCourseNestedSchema).optional().nullable(),
});

export const CurriculumUpdateSchema = CurriculumCreateSchema.partial();

export const CurriculumSchemaUpdate = CurriculumUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const CurriculumIndexSchema = z.object(nullableSchema(CurriculumUpdateSchema)).merge(BaseEntitySchema).extend({
    tryout_title: z.string().nullable().optional(),
    creator: z.object({ name: z.string() }).optional().nullable(),
});

export type CurriculumCreatePayload = z.infer<typeof CurriculumCreateSchema>;
export type CurriculumUpdatePayload = z.infer<typeof CurriculumUpdateSchema>;
export type CurriculumFormUpdatePayload = z.infer<typeof CurriculumSchemaUpdate>;
export type CurriculumEntity = z.infer<typeof CurriculumIndexSchema>;
