import { z } from "zod";
import { BaseResponseSchema, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TryoutItemParameterIndexSchema } from "../schema/TryoutItemParameterSchema";

export const TryoutItemParameterListResponseSchema = BaseResponseSchema(z.array(TryoutItemParameterIndexSchema));
export type TryoutItemParameterListResponse = z.infer<typeof TryoutItemParameterListResponseSchema>;

export const TryoutItemParameterShowResponseSchema = BaseResponseSchema(TryoutItemParameterIndexSchema);
export type TryoutItemParameterShowResponse = z.infer<typeof TryoutItemParameterShowResponseSchema>;

// Response khusus untuk trigger IRT calculation
export const IrtCalculateResponseSchema = GeneralResponseSchema.extend({
    data: z.object({
        job_id: z.string().optional().nullable(),
        message: z.string().optional().nullable(),
    }).optional().nullable(),
});
export type IrtCalculateResponse = z.infer<typeof IrtCalculateResponseSchema>;
