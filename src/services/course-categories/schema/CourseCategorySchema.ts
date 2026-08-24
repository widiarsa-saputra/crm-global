import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const CourseCategoryCreateSchema = z.object({
    parent_id: z.union([z.string(), z.number()]).optional().nullable(),
    name: z.string().min(1, "Nama kategori wajib diisi"),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional().nullable(),
});

export const CourseCategoryUpdateSchema = CourseCategoryCreateSchema.partial();

export const CourseCategorySchemaUpdate = CourseCategoryUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const CourseCategoryIndexSchema = z.object(nullableSchema(CourseCategoryUpdateSchema)).merge(BaseEntitySchema).extend({
    creator: z.object({ name: z.string() }).optional().nullable(),
    total_course: z.number().optional().nullable(),
    parent: z.object({
        name: z.string()
    }).optional().nullable()
});

export type CourseCategoryCreatePayload = z.infer<typeof CourseCategoryCreateSchema>;
export type CourseCategoryUpdatePayload = z.infer<typeof CourseCategoryUpdateSchema>;
export type CourseCategoryFormUpdatePayload = z.infer<typeof CourseCategorySchemaUpdate>;
export type CourseCategoryEntity = z.infer<typeof CourseCategoryIndexSchema>;
