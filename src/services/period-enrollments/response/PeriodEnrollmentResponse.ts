import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PeriodEnrollmentIndexSchema } from "../schema/PeriodEnrollmentSchema";

export const IndexPeriodEnrollmentResponseSchema = BaseResponseSchema(z.array(PeriodEnrollmentIndexSchema));
export type IndexPeriodEnrollmentResponse = z.infer<typeof IndexPeriodEnrollmentResponseSchema>;

export const PeriodEnrollmentMutationResponseSchema = BaseResponseSchema(PeriodEnrollmentIndexSchema);
export type PeriodEnrollmentMutationResponse = z.infer<typeof PeriodEnrollmentMutationResponseSchema>;

export const ShowPeriodEnrollmentResponseSchema = BaseResponseSchema(PeriodEnrollmentIndexSchema);
export type ShowPeriodEnrollmentResponse = z.infer<typeof ShowPeriodEnrollmentResponseSchema>;
