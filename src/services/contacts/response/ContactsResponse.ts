import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";


export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;

export const DeleteContactDataSchema = z.nullable(
    z.object({
        id: z.string(),
        nama: z.string(),
        email: z.string().email(),
        company: z.string().nullable(),
        segment_id: z.string().nullable(),
        email_status: z.enum(["active", "unsubscribed", "blocked"]),
        created_at: z.string(),
        updated_at: z.string(),
    })
).optional();


export type DeleteContactResponse = z.infer<typeof DeleteContactResponseSchema>;

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
    email_status: z.enum(["active", "unsubscribed", "blocked"]),
    created_at: z.string(),
    updated_at: z.string(),
    segment: SegmentSchema.optional(),
});

export const ContactListSchema = z.array(SingleContactSchema);


export type IndexContactResponse = z.infer<typeof IndexContactResponseSchema>;

export type SingleContactResponse = z.infer<typeof SingleContactSchema>;


export type ShowContactResponse = z.infer<typeof ShowContactResponseSchema>;


export type UpdateContactResponse = z.infer<typeof UpdateContactResponseSchema>;


export const CreateContactResponseSchema = BaseResponseSchema(SingleContactSchema);

export const DeleteContactResponseSchema = BaseResponseSchema(DeleteContactDataSchema);

export const IndexContactResponseSchema = BaseResponseSchema(ContactListSchema);

export const ShowContactResponseSchema = BaseResponseSchema(SingleContactSchema);

export const UpdateContactResponseSchema = BaseResponseSchema(SingleContactSchema);
