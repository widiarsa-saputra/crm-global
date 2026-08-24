import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { SingleFileSchema } from "@/services/file/response/IndexFileResponse";

export const CourseLevelEnum = ['beginner', 'intermediate', 'advanced'] as const;
export const CourseStatusEnum = ['draft', 'published', 'reviewed'] as const;

export const CourseCreateSchema = z.object({
    course_category_id: z.union([z.string(), z.number()]).optional().nullable(),
    thumbnail_file_id: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().min(1, "Judul kursus wajib diisi"),
    description: z.string().optional().nullable(),
    level: z.enum(CourseLevelEnum).optional().nullable(),
    status: z.enum(CourseStatusEnum),
    video_url: z.string().optional().nullable(),
    has_certificate: z.boolean().optional().nullable(),
    price: z.coerce.number().optional().nullable(),
    duration: z.coerce.number().optional().nullable(),
    course_sections: z.any().optional().nullable(),
});

export const CourseUpdateSchema = CourseCreateSchema.partial();

export const CourseSchemaUpdate = CourseUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const CourseIndexSchema = z.object(nullableSchema(CourseUpdateSchema)).merge(BaseEntitySchema).extend({
    course_sections: z.any().optional().nullable(),
    course_category_name: z.string().optional().nullable(),
    thumbnail_file: SingleFileSchema.optional().nullable(),
    total_students: z.coerce.number().optional().nullable()
});

export type CourseCreatePayload = z.infer<typeof CourseCreateSchema>;
export type CourseUpdatePayload = z.infer<typeof CourseUpdateSchema>;
export type CourseFormUpdatePayload = z.infer<typeof CourseSchemaUpdate>;
export type CourseEntity = z.infer<typeof CourseIndexSchema>;
