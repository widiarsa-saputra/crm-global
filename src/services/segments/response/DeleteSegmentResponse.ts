import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

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
