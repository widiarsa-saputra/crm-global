import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { SingleFileSchema } from "@/services/file/response/IndexFileResponse";

export const LessonSectionFileCreateSchema = z.object({
    lesson_section_id: z.union([z.string(), z.number()]).optional().nullable(),
    file_id: z.union([z.string(), z.number()]),
});

export const LessonSectionFileNestedSchema = LessonSectionFileCreateSchema.omit({ lesson_section_id: true }).extend({
    id: z.union([z.string(), z.number()]).optional().nullable(),
});

export const LessonSectionFileUpdateSchema = LessonSectionFileCreateSchema.partial();

export const LessonSectionFileSchemaUpdate = LessonSectionFileUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const LessonSectionFileIndexSchema = z.object(nullableSchema(LessonSectionFileUpdateSchema)).merge(BaseEntitySchema).extend({
    file: SingleFileSchema.optional().nullable(),
    creator: z.object({ name: z.string() }).optional().nullable(),
});

export type LessonSectionFileCreatePayload = z.infer<typeof LessonSectionFileCreateSchema>;
export type LessonSectionFileUpdatePayload = z.infer<typeof LessonSectionFileUpdateSchema>;
export type LessonSectionFileFormUpdatePayload = z.infer<typeof LessonSectionFileSchemaUpdate>;
export type LessonSectionFileEntity = z.infer<typeof LessonSectionFileIndexSchema>;
