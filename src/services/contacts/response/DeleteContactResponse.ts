import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const DeleteContactDataSchema = z.nullable(
    z.object({
        id: z.string(),
        nama: z.string(),
        email: z.string().email(),
        company: z.string().nullable(),
        segment_id: z.string().nullable(),
        email_status: z.enum(["valid", "invalid", "bounced", "unsubscribed"]),
        created_at: z.string(),
        updated_at: z.string(),
    })
).optional();

export const DeleteContactResponseSchema = BaseResponseSchema(DeleteContactDataSchema);
export type DeleteContactResponse = z.infer<typeof DeleteContactResponseSchema>;
