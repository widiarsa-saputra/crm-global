import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { QuestionBankIndexSchema } from "../schema/QuestionBankSchema";

export const QuestionBankListResponseSchema = BaseResponseSchema(z.array(QuestionBankIndexSchema));
export type QuestionBankListResponse = z.infer<typeof QuestionBankListResponseSchema>;

export const QuestionBankCreateResponseSchema = BaseResponseSchema(QuestionBankIndexSchema);
export type QuestionBankCreateResponse = z.infer<typeof QuestionBankCreateResponseSchema>;

export const QuestionBankUpdateResponseSchema = BaseResponseSchema(QuestionBankIndexSchema);
export type QuestionBankUpdateResponse = z.infer<typeof QuestionBankUpdateResponseSchema>;

export const QuestionBankShowResponseSchema = BaseResponseSchema(QuestionBankIndexSchema);
export type QuestionBankShowResponse = z.infer<typeof QuestionBankShowResponseSchema>;
