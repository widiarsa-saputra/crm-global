import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { SingleFileSchema } from "@/services/file/response/IndexFileResponse";
import { LessonSectionFileNestedSchema } from "@/services/lesson-section-files/schema/LessonSectionFileSchema";

export const LessonSectionTypeEnum = ['video', 'article', 'pdf', 'quiz'] as const;

export const LessonSectionCreateSchema = z.object({
    lesson_id: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().min(1, "Judul section wajib diisi"),
    content: z.string().optional().nullable(),
    type: z.enum(LessonSectionTypeEnum).nullable(),
    duration: z.coerce.number().optional().nullable(),
    order: z.coerce.number().optional().nullable(),
    can_preview: z.coerce.boolean().optional().nullable(),
});

export const LessonSectionNestedSchema = LessonSectionCreateSchema.omit({ lesson_id: true }).extend({
    id: z.union([z.string(), z.number()]).optional().nullable(),
    lesson_section_file: z.array(LessonSectionFileNestedSchema).optional().nullable(),
});

export const LessonSectionUpdateSchema = LessonSectionCreateSchema.partial();

export const LessonSectionSchemaUpdate = LessonSectionUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const LessonSectionIndexSchema = z.object(nullableSchema(LessonSectionUpdateSchema)).merge(BaseEntitySchema).extend({
    lesson_section_file: z.array(SingleFileSchema).optional().nullable(),
    creator: z.object({ name: z.string() }).optional().nullable(),
    lesson_title: z.string().nullable().optional(),
});

export type LessonSectionCreatePayload = z.infer<typeof LessonSectionCreateSchema>;
export type LessonSectionUpdatePayload = z.infer<typeof LessonSectionUpdateSchema>;
export type LessonSectionFormUpdatePayload = z.infer<typeof LessonSectionSchemaUpdate>;
export type LessonSectionEntity = z.infer<typeof LessonSectionIndexSchema>;
