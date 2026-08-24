import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import {
    StudentMonthlyProgressIndexSchema,
    StudentProgressDetailSchema,
} from "../schema/StudentProgressSchema";

export const StudentProgressListResponseSchema = BaseResponseSchema(
    z.array(StudentMonthlyProgressIndexSchema)
);
export type StudentProgressListResponse = z.infer<typeof StudentProgressListResponseSchema>;

export const StudentProgressShowResponseSchema = BaseResponseSchema(StudentProgressDetailSchema);
export type StudentProgressShowResponse = z.infer<typeof StudentProgressShowResponseSchema>;
