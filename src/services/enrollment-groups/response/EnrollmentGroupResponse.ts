import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { EnrollmentGroupIndexSchema } from "../schema/EnrollmentGroupSchema";

export const IndexEnrollmentGroupResponseSchema = BaseResponseSchema(z.array(EnrollmentGroupIndexSchema));
export type IndexEnrollmentGroupResponse = z.infer<typeof IndexEnrollmentGroupResponseSchema>;

export const EnrollmentGroupMutationResponseSchema = BaseResponseSchema(EnrollmentGroupIndexSchema);
export type EnrollmentGroupMutationResponse = z.infer<typeof EnrollmentGroupMutationResponseSchema>;

export const ShowEnrollmentGroupResponseSchema = BaseResponseSchema(EnrollmentGroupIndexSchema);
export type ShowEnrollmentGroupResponse = z.infer<typeof ShowEnrollmentGroupResponseSchema>;
