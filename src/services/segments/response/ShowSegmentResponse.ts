import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleSegmentSchema } from "./IndexSegmentResponse";

export const ShowSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);
export type ShowSegmentResponse = z.infer<typeof ShowSegmentResponseSchema>;
