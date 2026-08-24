import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleSegmentSchema } from "./IndexSegmentResponse";

export const UpdateSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);
export type UpdateSegmentResponse = z.infer<typeof UpdateSegmentResponseSchema>;
