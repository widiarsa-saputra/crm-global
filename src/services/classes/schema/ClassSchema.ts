import { z } from "zod";
import { nullableSchema, IsActiveEnum } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const ClassCreateSchema = z.object({
    name: z.string().min(1, "Nama kelas wajib diisi"),
    is_active: z.enum(IsActiveEnum).optional().nullable(),
});

export const ClassUpdateSchema = ClassCreateSchema.partial();

// Skema untuk form update yang memerlukan ID
export const ClassSchemaUpdate = ClassUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

// Skema index untuk response yang meng-extend BaseEntitySchema dan membuat seluruh kolom bisa null
export const ClassIndexSchema = z.object(nullableSchema(ClassUpdateSchema)).merge(BaseEntitySchema);

export type ClassCreatePayload = z.infer<typeof ClassCreateSchema>;
export type ClassUpdatePayload = z.infer<typeof ClassUpdateSchema>;
export type ClassFormUpdatePayload = z.infer<typeof ClassSchemaUpdate>;
export type ClassEntity = z.infer<typeof ClassIndexSchema>;
