import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const AssignTryoutCreateSchema = z.object({
    course_id: z.union([z.string(), z.number()]).optional().nullable(),
    period_id: z.union([z.string(), z.number()]).optional().nullable(),
    tryout_id: z.union([z.string(), z.number()]).optional().nullable(),
    lesson_id: z.union([z.string(), z.number()]).optional().nullable(),
    start_time: z.string().optional().nullable(),
    deadline_time: z.string().optional().nullable(),
    max_attempts: z.coerce.number().optional().nullable(),
    order: z.coerce.number().optional().nullable(),
});

export const AssignTryoutUpdateSchema = AssignTryoutCreateSchema.partial();

export const AssignTryoutSchemaUpdate = AssignTryoutUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const AssignTryoutIndexSchema = z.object(nullableSchema(AssignTryoutUpdateSchema)).merge(BaseEntitySchema).extend({
    course_name: z.string().optional().nullable(),
    period_title: z.string().optional().nullable(),
    tryout_title: z.string().optional().nullable(),
    lesson_title: z.string().optional().nullable(),
    course: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    period: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    tryout: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
    lesson: z.object({ title: z.string().optional().nullable() }).optional().nullable(),
});

export type AssignTryoutCreatePayload = z.infer<typeof AssignTryoutCreateSchema>;
export type AssignTryoutUpdatePayload = z.infer<typeof AssignTryoutUpdateSchema>;
export type AssignTryoutFormUpdatePayload = z.infer<typeof AssignTryoutSchemaUpdate>;
export type AssignTryoutEntity = z.infer<typeof AssignTryoutIndexSchema>;
