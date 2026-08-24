import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { QuestionOptionIndexSchema } from "../schema/QuestionOptionSchema";

export const QuestionOptionListResponseSchema = BaseResponseSchema(z.array(QuestionOptionIndexSchema));
export type QuestionOptionListResponse = z.infer<typeof QuestionOptionListResponseSchema>;

export const QuestionOptionCreateResponseSchema = BaseResponseSchema(QuestionOptionIndexSchema);
export type QuestionOptionCreateResponse = z.infer<typeof QuestionOptionCreateResponseSchema>;

export const QuestionOptionUpdateResponseSchema = BaseResponseSchema(QuestionOptionIndexSchema);
export type QuestionOptionUpdateResponse = z.infer<typeof QuestionOptionUpdateResponseSchema>;

export const QuestionOptionShowResponseSchema = BaseResponseSchema(QuestionOptionIndexSchema);
export type QuestionOptionShowResponse = z.infer<typeof QuestionOptionShowResponseSchema>;
