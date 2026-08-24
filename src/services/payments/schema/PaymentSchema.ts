import { z } from "zod";
import { nullableSchema } from "@/lib/utils";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { SingleFileSchema } from "@/services/file/response/IndexFileResponse";

export const PaymentCreateSchema = z.object({
    enrollment_id: z.union([z.string(), z.number()]).optional().nullable(),
    nominal: z.coerce.number().optional().nullable(),
    reason: z.string().optional().nullable(),
    evidence_file_id: z.union([z.string(), z.number()]).optional().nullable(),
});

export const PaymentUpdateSchema = PaymentCreateSchema.partial();

export const PaymentSchemaUpdate = PaymentUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const PaymentIndexSchema = z.object(nullableSchema(PaymentUpdateSchema)).merge(BaseEntitySchema).extend({
    evidence_file: SingleFileSchema.optional().nullable(),
    enrollment_student_name: z.string().optional().nullable(),
    enrollment: z.object({ student: z.object({ name: z.string().optional().nullable() }).optional().nullable() }).optional().nullable(),
});

export type PaymentCreatePayload = z.infer<typeof PaymentCreateSchema>;
export type PaymentUpdatePayload = z.infer<typeof PaymentUpdateSchema>;
export type PaymentFormUpdatePayload = z.infer<typeof PaymentSchemaUpdate>;
export type PaymentEntity = z.infer<typeof PaymentIndexSchema>;
