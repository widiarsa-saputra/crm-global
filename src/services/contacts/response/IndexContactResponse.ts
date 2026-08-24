import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const SegmentSchema = z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const SingleContactSchema = z.object({
    id: z.string(),
    segment_id: z.string().nullable(),
    nama: z.string(),
    email: z.string().email(),
    company: z.string().nullable(),
    email_status: z.enum(["valid", "invalid", "bounced", "unsubscribed"]),
    created_at: z.string(),
    updated_at: z.string(),
    segment: SegmentSchema.optional(),
});

export const ContactListSchema = z.array(SingleContactSchema);
export const IndexContactResponseSchema = BaseResponseSchema(ContactListSchema);
export type IndexContactResponse = z.infer<typeof IndexContactResponseSchema>;
export type SingleContactResponse = z.infer<typeof SingleContactSchema>;
