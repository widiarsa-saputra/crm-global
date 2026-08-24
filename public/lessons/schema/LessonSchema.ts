import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { LessonSectionNestedSchema, LessonSectionIndexSchema } from "@/services/lesson-sections/schema/LessonSectionSchema";

export const LessonCreateSchema = z.object({
    course_section_id: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().min(1, "Judul lesson wajib diisi"),
    order: z.coerce.number().optional().nullable(),
    duration: z.coerce.number().optional().nullable(),
});

export const LessonNestedSchema = LessonCreateSchema.omit({ course_section_id: true }).extend({
    id: z.union([z.string(), z.number()]).optional().nullable(),
    lesson_sections: z.array(LessonSectionNestedSchema).optional().nullable(),
});

export const LessonUpdateSchema = LessonCreateSchema.partial();

export const LessonSchemaUpdate = LessonUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const LessonIndexSchema = z.object(nullableSchema(LessonUpdateSchema)).merge(BaseEntitySchema).extend({
    lesson_sections: z.array(LessonSectionIndexSchema).optional().nullable(),
    creator: z.object({ name: z.string() }).optional().nullable(),
    course_section_title: z.string().nullable().optional()
});

export type LessonCreatePayload = z.infer<typeof LessonCreateSchema>;
export type LessonUpdatePayload = z.infer<typeof LessonUpdateSchema>;
export type LessonFormUpdatePayload = z.infer<typeof LessonSchemaUpdate>;
export type LessonEntity = z.infer<typeof LessonIndexSchema>;
