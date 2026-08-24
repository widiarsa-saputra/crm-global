import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { LessonIndexSchema } from "../schema/LessonSchema";

export const LessonListResponseSchema = BaseResponseSchema(z.array(LessonIndexSchema));
export type LessonListResponse = z.infer<typeof LessonListResponseSchema>;

export const LessonCreateResponseSchema = BaseResponseSchema(LessonIndexSchema);
export type LessonCreateResponse = z.infer<typeof LessonCreateResponseSchema>;

export const LessonUpdateResponseSchema = BaseResponseSchema(LessonIndexSchema);
export type LessonUpdateResponse = z.infer<typeof LessonUpdateResponseSchema>;

export const LessonShowResponseSchema = BaseResponseSchema(LessonIndexSchema);
export type LessonShowResponse = z.infer<typeof LessonShowResponseSchema>;
