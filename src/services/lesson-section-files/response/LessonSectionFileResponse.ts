import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { LessonSectionFileIndexSchema } from "../schema/LessonSectionFileSchema";

export const IndexLessonSectionFileResponseSchema = BaseResponseSchema(z.array(LessonSectionFileIndexSchema));
export type IndexLessonSectionFileResponse = z.infer<typeof IndexLessonSectionFileResponseSchema>;

export const LessonSectionFileMutationResponseSchema = BaseResponseSchema(LessonSectionFileIndexSchema);
export type LessonSectionFileMutationResponse = z.infer<typeof LessonSectionFileMutationResponseSchema>;

export const ShowLessonSectionFileResponseSchema = BaseResponseSchema(LessonSectionFileIndexSchema);
export type ShowLessonSectionFileResponse = z.infer<typeof ShowLessonSectionFileResponseSchema>;
