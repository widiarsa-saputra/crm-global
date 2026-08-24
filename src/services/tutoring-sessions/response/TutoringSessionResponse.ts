import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TutoringSessionIndexSchema } from "../schema/TutoringSessionSchema";

export const IndexTutoringSessionResponseSchema = BaseResponseSchema(z.array(TutoringSessionIndexSchema));
export type IndexTutoringSessionResponse = z.infer<typeof IndexTutoringSessionResponseSchema>;

export const TutoringSessionMutationResponseSchema = BaseResponseSchema(TutoringSessionIndexSchema);
export type TutoringSessionMutationResponse = z.infer<typeof TutoringSessionMutationResponseSchema>;

export const ShowTutoringSessionResponseSchema = BaseResponseSchema(TutoringSessionIndexSchema);
export type ShowTutoringSessionResponse = z.infer<typeof ShowTutoringSessionResponseSchema>;
