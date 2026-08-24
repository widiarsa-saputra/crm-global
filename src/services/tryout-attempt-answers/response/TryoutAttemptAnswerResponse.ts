import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutAttemptAnswerIndexSchema } from "../schema/TryoutAttemptAnswerSchema";

export const TryoutAttemptAnswerListResponseSchema = BaseResponseSchema(z.array(TryoutAttemptAnswerIndexSchema));
export type TryoutAttemptAnswerListResponse = z.infer<typeof TryoutAttemptAnswerListResponseSchema>;

export const TryoutAttemptAnswerCreateResponseSchema = BaseResponseSchema(TryoutAttemptAnswerIndexSchema);
export type TryoutAttemptAnswerCreateResponse = z.infer<typeof TryoutAttemptAnswerCreateResponseSchema>;

export const TryoutAttemptAnswerUpdateResponseSchema = BaseResponseSchema(TryoutAttemptAnswerIndexSchema);
export type TryoutAttemptAnswerUpdateResponse = z.infer<typeof TryoutAttemptAnswerUpdateResponseSchema>;

export const TryoutAttemptAnswerShowResponseSchema = BaseResponseSchema(TryoutAttemptAnswerIndexSchema);
export type TryoutAttemptAnswerShowResponse = z.infer<typeof TryoutAttemptAnswerShowResponseSchema>;
