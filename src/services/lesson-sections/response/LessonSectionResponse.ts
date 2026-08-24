import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { LessonSectionIndexSchema } from "../schema/LessonSectionSchema";

export const IndexLessonSectionResponseSchema = BaseResponseSchema(z.array(LessonSectionIndexSchema));
export type IndexLessonSectionResponse = z.infer<typeof IndexLessonSectionResponseSchema>;

export const LessonSectionMutationResponseSchema = BaseResponseSchema(LessonSectionIndexSchema);
export type LessonSectionMutationResponse = z.infer<typeof LessonSectionMutationResponseSchema>;

export const ShowLessonSectionResponseSchema = BaseResponseSchema(LessonSectionIndexSchema);
export type ShowLessonSectionResponse = z.infer<typeof ShowLessonSectionResponseSchema>;
