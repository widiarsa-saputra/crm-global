import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

export const CreateSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);

export type CreateSegmentResponse = z.infer<typeof CreateSegmentResponseSchema>;

export const DeleteSegmentDataSchema = z.nullable(
    z.object({
        id: z.string(),
        name: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
    })
).optional();

export const DeleteSegmentResponseSchema = BaseResponseSchema(DeleteSegmentDataSchema);

export type DeleteSegmentResponse = z.infer<typeof DeleteSegmentResponseSchema>;

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

export const ShowSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);

export type ShowSegmentResponse = z.infer<typeof ShowSegmentResponseSchema>;

export const UpdateSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);

export type UpdateSegmentResponse = z.infer<typeof UpdateSegmentResponseSchema>;

