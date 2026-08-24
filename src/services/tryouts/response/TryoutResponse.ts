import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutIndexSchema } from "../schema/TryoutSchema";

export const TryoutListResponseSchema = BaseResponseSchema(z.array(TryoutIndexSchema));
export type TryoutListResponse = z.infer<typeof TryoutListResponseSchema>;

export const TryoutCreateResponseSchema = BaseResponseSchema(TryoutIndexSchema);
export type TryoutCreateResponse = z.infer<typeof TryoutCreateResponseSchema>;

export const TryoutUpdateResponseSchema = BaseResponseSchema(TryoutIndexSchema);
export type TryoutUpdateResponse = z.infer<typeof TryoutUpdateResponseSchema>;

export const TryoutShowResponseSchema = BaseResponseSchema(TryoutIndexSchema);
export type TryoutShowResponse = z.infer<typeof TryoutShowResponseSchema>;
