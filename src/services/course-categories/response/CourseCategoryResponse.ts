import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { CourseCategoryIndexSchema } from "../schema/CourseCategorySchema";

export const CourseCategoryListResponseSchema = BaseResponseSchema(z.array(CourseCategoryIndexSchema));
export type CourseCategoryListResponse = z.infer<typeof CourseCategoryListResponseSchema>;

export const CourseCategoryCreateResponseSchema = BaseResponseSchema(CourseCategoryIndexSchema);
export type CourseCategoryCreateResponse = z.infer<typeof CourseCategoryCreateResponseSchema>;

export const CourseCategoryUpdateResponseSchema = BaseResponseSchema(CourseCategoryIndexSchema);
export type CourseCategoryUpdateResponse = z.infer<typeof CourseCategoryUpdateResponseSchema>;

export const CourseCategoryShowResponseSchema = BaseResponseSchema(CourseCategoryIndexSchema);
export type CourseCategoryShowResponse = z.infer<typeof CourseCategoryShowResponseSchema>;
