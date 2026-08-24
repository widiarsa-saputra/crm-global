import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutSubtestScoreIndexSchema } from "../schema/TryoutSubtestScoreSchema";

export const TryoutSubtestScoreListResponseSchema = BaseResponseSchema(z.array(TryoutSubtestScoreIndexSchema));
export type TryoutSubtestScoreListResponse = z.infer<typeof TryoutSubtestScoreListResponseSchema>;

export const TryoutSubtestScoreShowResponseSchema = BaseResponseSchema(TryoutSubtestScoreIndexSchema);
export type TryoutSubtestScoreShowResponse = z.infer<typeof TryoutSubtestScoreShowResponseSchema>;
