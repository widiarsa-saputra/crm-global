import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { CourseIndexSchema } from "../schema/CourseSchema";

export const CourseListResponseSchema = BaseResponseSchema(z.array(CourseIndexSchema));
export type CourseListResponse = z.infer<typeof CourseListResponseSchema>;

export const CourseCreateResponseSchema = BaseResponseSchema(CourseIndexSchema);
export type CourseCreateResponse = z.infer<typeof CourseCreateResponseSchema>;

export const CourseUpdateResponseSchema = BaseResponseSchema(CourseIndexSchema);
export type CourseUpdateResponse = z.infer<typeof CourseUpdateResponseSchema>;

export const CourseShowResponseSchema = BaseResponseSchema(CourseIndexSchema);
export type CourseShowResponse = z.infer<typeof CourseShowResponseSchema>;
