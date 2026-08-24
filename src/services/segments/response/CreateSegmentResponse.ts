import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleSegmentSchema } from "./IndexSegmentResponse";

export const CreateSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);
export type CreateSegmentResponse = z.infer<typeof CreateSegmentResponseSchema>;
