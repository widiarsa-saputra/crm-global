import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutSubtestIndexSchema } from "@/services/tryout-subtests/schema/TryoutSubtestSchema";

export const ScoringSystemEnum = ['standard', 'irt', 'raw_points'] as const;

export const TryoutCreateSchema = z.object({
    title: z.string().min(1, "Judul tryout wajib diisi"),
    description: z.string().optional().nullable(),
    is_active: z.boolean().default(false),
    default_max_attempts: z.coerce.number().optional().nullable(),
    is_published: z.boolean().default(false),
});

export const TryoutUpdateSchema = TryoutCreateSchema.partial();

export const TryoutSchemaUpdate = TryoutUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const TryoutIndexSchema = z.object(nullableSchema(TryoutUpdateSchema)).merge(BaseEntitySchema).extend({
    subtests: z.array(TryoutSubtestIndexSchema).optional().nullable(),
});

export type TryoutCreatePayload = z.infer<typeof TryoutCreateSchema>;
export type TryoutUpdatePayload = z.infer<typeof TryoutUpdateSchema>;
export type TryoutFormUpdatePayload = z.infer<typeof TryoutSchemaUpdate>;
export type TryoutEntity = z.infer<typeof TryoutIndexSchema>;
