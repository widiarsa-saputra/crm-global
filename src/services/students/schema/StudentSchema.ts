import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const StudentCreateSchema = z.object({
    name: z.string().min(1, "Nama harus diisi"),
    phone: z.string().optional().nullable(),
    email: z.string().email("Format email tidak valid").optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable(),
    parent_name: z.string().min(1, "Nama orang tua harus diisi"),
});

export const StudentUpdateSchema = StudentCreateSchema.partial();

// Skema untuk form update yang memerlukan ID
export const StudentSchemaUpdate = StudentUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

// Skema index untuk response yang meng-extend BaseEntitySchema dan membuat seluruh kolom bisa null
export const StudentIndexSchema = z.object(nullableSchema(StudentUpdateSchema)).merge(BaseEntitySchema);

export type StudentCreatePayload = z.infer<typeof StudentCreateSchema>;
export type StudentUpdatePayload = z.infer<typeof StudentUpdateSchema>;
export type StudentFormUpdatePayload = z.infer<typeof StudentSchemaUpdate>;
export type StudentEntity = z.infer<typeof StudentIndexSchema>;
