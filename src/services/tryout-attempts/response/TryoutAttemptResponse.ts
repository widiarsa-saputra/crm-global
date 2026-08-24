import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutAttemptIndexSchema } from "../schema/TryoutAttemptSchema";

export const TryoutAttemptListResponseSchema = BaseResponseSchema(z.array(TryoutAttemptIndexSchema));
export type TryoutAttemptListResponse = z.infer<typeof TryoutAttemptListResponseSchema>;

export const TryoutAttemptCreateResponseSchema = BaseResponseSchema(TryoutAttemptIndexSchema);
export type TryoutAttemptCreateResponse = z.infer<typeof TryoutAttemptCreateResponseSchema>;

export const TryoutAttemptUpdateResponseSchema = BaseResponseSchema(TryoutAttemptIndexSchema);
export type TryoutAttemptUpdateResponse = z.infer<typeof TryoutAttemptUpdateResponseSchema>;

export const TryoutAttemptShowResponseSchema = BaseResponseSchema(TryoutAttemptIndexSchema);
export type TryoutAttemptShowResponse = z.infer<typeof TryoutAttemptShowResponseSchema>;
