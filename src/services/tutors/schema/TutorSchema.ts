import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const TutorCreateSchema = z.object({
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Format email tidak valid").optional().nullable().or(z.literal("")),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    description: z.string().min(1, "Deskripsi harus diisi"),
});

export const TutorUpdateSchema = TutorCreateSchema.partial();

// Skema untuk form update yang memerlukan ID
export const TutorSchemaUpdate = TutorUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

// Skema index untuk response yang meng-extend BaseEntitySchema dan membuat seluruh kolom bisa null
export const TutorIndexSchema = z.object(nullableSchema(TutorUpdateSchema)).merge(BaseEntitySchema);

export type TutorCreatePayload = z.infer<typeof TutorCreateSchema>;
export type TutorUpdatePayload = z.infer<typeof TutorUpdateSchema>;
export type TutorFormUpdatePayload = z.infer<typeof TutorSchemaUpdate>;
export type TutorEntity = z.infer<typeof TutorIndexSchema>;
