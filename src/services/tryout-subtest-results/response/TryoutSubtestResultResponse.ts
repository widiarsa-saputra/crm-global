import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutSubtestResultIndexSchema } from "../schema/TryoutSubtestResultSchema";

export const TryoutSubtestResultListResponseSchema = BaseResponseSchema(z.array(TryoutSubtestResultIndexSchema));
export type TryoutSubtestResultListResponse = z.infer<typeof TryoutSubtestResultListResponseSchema>;

export const TryoutSubtestResultShowResponseSchema = BaseResponseSchema(TryoutSubtestResultIndexSchema);
export type TryoutSubtestResultShowResponse = z.infer<typeof TryoutSubtestResultShowResponseSchema>;

export const TryoutSubtestResultMutationResponseSchema = BaseResponseSchema(TryoutSubtestResultIndexSchema);
export type TryoutSubtestResultMutationResponse = z.infer<typeof TryoutSubtestResultMutationResponseSchema>;
