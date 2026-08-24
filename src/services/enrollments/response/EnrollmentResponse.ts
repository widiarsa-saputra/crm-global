import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { EnrollmentIndexSchema } from "../schema/EnrollmentSchema";

export const IndexEnrollmentResponseSchema = BaseResponseSchema(z.array(EnrollmentIndexSchema));
export type IndexEnrollmentResponse = z.infer<typeof IndexEnrollmentResponseSchema>;

export const EnrollmentMutationResponseSchema = BaseResponseSchema(EnrollmentIndexSchema);
export type EnrollmentMutationResponse = z.infer<typeof EnrollmentMutationResponseSchema>;

export const ShowEnrollmentResponseSchema = BaseResponseSchema(EnrollmentIndexSchema);
export type ShowEnrollmentResponse = z.infer<typeof ShowEnrollmentResponseSchema>;
