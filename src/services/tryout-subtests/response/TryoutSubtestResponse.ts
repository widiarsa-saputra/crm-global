import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutSubtestIndexSchema } from "../schema/TryoutSubtestSchema";

export const TryoutSubtestListResponseSchema = BaseResponseSchema(z.array(TryoutSubtestIndexSchema));
export type TryoutSubtestListResponse = z.infer<typeof TryoutSubtestListResponseSchema>;

export const TryoutSubtestCreateResponseSchema = BaseResponseSchema(TryoutSubtestIndexSchema);
export type TryoutSubtestCreateResponse = z.infer<typeof TryoutSubtestCreateResponseSchema>;

export const TryoutSubtestUpdateResponseSchema = BaseResponseSchema(TryoutSubtestIndexSchema);
export type TryoutSubtestUpdateResponse = z.infer<typeof TryoutSubtestUpdateResponseSchema>;

export const TryoutSubtestShowResponseSchema = BaseResponseSchema(TryoutSubtestIndexSchema);
export type TryoutSubtestShowResponse = z.infer<typeof TryoutSubtestShowResponseSchema>;
