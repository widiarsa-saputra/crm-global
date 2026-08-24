import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { LessonNestedSchema, LessonIndexSchema } from "@/services/lessons/schema/LessonSchema";

export const CourseSectionCreateSchema = z.object({
    course_id: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().min(1, "Judul section wajib diisi"),
    order: z.coerce.number().optional().nullable(),
});

export const CourseSectionNestedSchema = CourseSectionCreateSchema.extend({
    id: z.union([z.string(), z.number()]).optional().nullable(),
    lessons: z.array(LessonNestedSchema).optional().nullable(),
});

export const CourseSectionUpdateSchema = CourseSectionCreateSchema.partial();

export const CourseSectionSchemaUpdate = CourseSectionUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const CourseSectionIndexSchema = z.object(nullableSchema(CourseSectionUpdateSchema)).merge(BaseEntitySchema).extend({
    lessons: z.array(LessonIndexSchema).optional().nullable(),
    course_title: z.string().nullable().optional(),
    creator: z.object({ name: z.string() }).optional().nullable(),
});

export type CourseSectionCreatePayload = z.infer<typeof CourseSectionCreateSchema>;
export type CourseSectionUpdatePayload = z.infer<typeof CourseSectionUpdateSchema>;
export type CourseSectionFormUpdatePayload = z.infer<typeof CourseSectionSchemaUpdate>;
export type CourseSectionEntity = z.infer<typeof CourseSectionIndexSchema>;
