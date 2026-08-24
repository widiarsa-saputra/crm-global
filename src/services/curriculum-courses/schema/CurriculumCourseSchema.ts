import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const CurriculumCourseCreateSchema = z.object({
    course_id: z.union([z.string(), z.number()]),
    curriculum_id: z.union([z.string(), z.number()]).optional().nullable(),
});

export const CurriculumCourseNestedSchema = CurriculumCourseCreateSchema.omit({ curriculum_id: true }).extend({
    id: z.union([z.string(), z.number()]).optional().nullable(),
});

export const CurriculumCourseUpdateSchema = CurriculumCourseCreateSchema.partial();

export const CurriculumCourseSchemaUpdate = CurriculumCourseUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const CurriculumCourseIndexSchema = z.object(nullableSchema(CurriculumCourseUpdateSchema)).merge(BaseEntitySchema).extend({
    course_name: z.string().optional().nullable(),
    curriculum_title: z.string().optional().nullable(),
    course: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    curriculum: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    creator: z.object({ name: z.string() }).optional().nullable(),
});

export type CurriculumCourseCreatePayload = z.infer<typeof CurriculumCourseCreateSchema>;
export type CurriculumCourseUpdatePayload = z.infer<typeof CurriculumCourseUpdateSchema>;
export type CurriculumCourseFormUpdatePayload = z.infer<typeof CurriculumCourseSchemaUpdate>;
export type CurriculumCourseEntity = z.infer<typeof CurriculumCourseIndexSchema>;
