import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const SingleSegmentSchema = z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const SegmentListSchema = z.array(SingleSegmentSchema);
export const IndexSegmentResponseSchema = BaseResponseSchema(SegmentListSchema);
export type IndexSegmentResponse = z.infer<typeof IndexSegmentResponseSchema>;
export type SingleSegmentResponse = z.infer<typeof SingleSegmentSchema>;
