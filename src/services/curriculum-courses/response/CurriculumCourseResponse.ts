import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { CurriculumCourseIndexSchema } from "../schema/CurriculumCourseSchema";

export const IndexCurriculumCourseResponseSchema = BaseResponseSchema(z.array(CurriculumCourseIndexSchema));
export type IndexCurriculumCourseResponse = z.infer<typeof IndexCurriculumCourseResponseSchema>;

export const CurriculumCourseMutationResponseSchema = BaseResponseSchema(CurriculumCourseIndexSchema);
export type CurriculumCourseMutationResponse = z.infer<typeof CurriculumCourseMutationResponseSchema>;

export const ShowCurriculumCourseResponseSchema = BaseResponseSchema(CurriculumCourseIndexSchema);
export type ShowCurriculumCourseResponse = z.infer<typeof ShowCurriculumCourseResponseSchema>;
