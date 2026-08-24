import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutQuestionIndexSchema } from "../schema/TryoutQuestionSchema";

export const TryoutQuestionListResponseSchema = BaseResponseSchema(z.array(TryoutQuestionIndexSchema));
export type TryoutQuestionListResponse = z.infer<typeof TryoutQuestionListResponseSchema>;

export const TryoutQuestionCreateResponseSchema = BaseResponseSchema(TryoutQuestionIndexSchema);
export type TryoutQuestionCreateResponse = z.infer<typeof TryoutQuestionCreateResponseSchema>;

export const TryoutQuestionUpdateResponseSchema = BaseResponseSchema(TryoutQuestionIndexSchema);
export type TryoutQuestionUpdateResponse = z.infer<typeof TryoutQuestionUpdateResponseSchema>;

export const TryoutQuestionShowResponseSchema = BaseResponseSchema(TryoutQuestionIndexSchema);
export type TryoutQuestionShowResponse = z.infer<typeof TryoutQuestionShowResponseSchema>;
