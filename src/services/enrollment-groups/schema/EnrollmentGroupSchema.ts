import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const EnrollmentGroupCreateSchema = z.object({
    tutor_id: z.union([z.string(), z.number()]).optional().nullable(),
    name: z.string().min(1, "Nama group wajib diisi"),
    can_request_tutoring: z.coerce.boolean().optional().nullable(),
});

export const EnrollmentGroupUpdateSchema = EnrollmentGroupCreateSchema.partial();

export const EnrollmentGroupSchemaUpdate = EnrollmentGroupUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const EnrollmentGroupIndexSchema = z.object(nullableSchema(EnrollmentGroupUpdateSchema)).merge(BaseEntitySchema).extend({
    total_student: z.number().optional().nullable(),
});

export type EnrollmentGroupCreatePayload = z.infer<typeof EnrollmentGroupCreateSchema>;
export type EnrollmentGroupUpdatePayload = z.infer<typeof EnrollmentGroupUpdateSchema>;
export type EnrollmentGroupFormUpdatePayload = z.infer<typeof EnrollmentGroupSchemaUpdate>;
export type EnrollmentGroupEntity = z.infer<typeof EnrollmentGroupIndexSchema>;
