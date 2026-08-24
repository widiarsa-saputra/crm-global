import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { StudentIndexSchema } from "../schema/StudentSchema";

export const StudentListResponseSchema = BaseResponseSchema(z.array(StudentIndexSchema));
export type StudentListResponse = z.infer<typeof StudentListResponseSchema>;

export const StudentCreateResponseSchema = BaseResponseSchema(StudentIndexSchema);
export type StudentCreateResponse = z.infer<typeof StudentCreateResponseSchema>;

export const StudentUpdateResponseSchema = BaseResponseSchema(StudentIndexSchema);
export type StudentUpdateResponse = z.infer<typeof StudentUpdateResponseSchema>;

export const StudentShowResponseSchema = BaseResponseSchema(StudentIndexSchema);
export type StudentShowResponse = z.infer<typeof StudentShowResponseSchema>;
