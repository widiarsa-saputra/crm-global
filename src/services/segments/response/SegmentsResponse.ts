import { BaseResponseSchema, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";


export type CreateSegmentResponse = z.infer<typeof CreateSegmentResponseSchema>;

export const DeleteSegmentDataSchema = z.nullable(
    z.object({
        id: z.string(),
        name: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
    })
).optional();


export type DeleteSegmentResponse = z.infer<typeof DeleteSegmentResponseSchema>;

export const SingleSegmentSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    total_contact: z.number().optional().default(0),
    created_at: z.string().optional().nullable(),
    updated_at: z.string().optional().nullable(),
});

export const SegmentListSchema = z.array(SingleSegmentSchema);


export type IndexSegmentResponse = z.infer<typeof IndexSegmentResponseSchema>;

export type SingleSegmentResponse = z.infer<typeof SingleSegmentSchema>;


export type ShowSegmentResponse = z.infer<typeof ShowSegmentResponseSchema>;


export type UpdateSegmentResponse = z.infer<typeof UpdateSegmentResponseSchema>;


export const CreateSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);

export const DeleteSegmentResponseSchema = GeneralResponseSchema;

export const IndexSegmentResponseSchema = BaseResponseSchema(SegmentListSchema);

export const ShowSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);

export const UpdateSegmentResponseSchema = BaseResponseSchema(SingleSegmentSchema);
