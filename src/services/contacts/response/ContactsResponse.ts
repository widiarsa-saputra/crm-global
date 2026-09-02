import { BaseResponseSchema, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";
import { statusEmailType } from "@/services/contacts/schema/ContactsSchema";


export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;

export const DeleteContactDataSchema = z.nullable(
    z.object({
        id: z.string(),
        nama: z.string(),
        email: z.string().email(),
        company: z.string().nullable(),
        segment_id: z.string().nullable(),
        email_status: z.enum(statusEmailType),
        location: z.string().nullable().optional(),
        fax: z.string().nullable().optional(),
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
    email_status: z.enum(statusEmailType),
    location: z.string().nullable().optional(),
    fax: z.string().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    total_sent: z.number().optional(),
    raw_engagement: z.number().optional(),
    bayesian_engagement: z.number().optional(),
    last_engagement_count_date: z.string().nullable().optional(),
    segment: SegmentSchema.optional().nullable(),
    total_opens: z.number().optional(),
    total_clicks: z.number().optional(),
});

export const ContactListSchema = z.array(SingleContactSchema);


export type IndexContactResponse = z.infer<typeof IndexContactResponseSchema>;

export type SingleContactResponse = z.infer<typeof SingleContactSchema>;


export type ShowContactResponse = z.infer<typeof ShowContactResponseSchema>;


export type UpdateContactResponse = z.infer<typeof UpdateContactResponseSchema>;


export const CreateContactResponseSchema = BaseResponseSchema(SingleContactSchema);

export const DeleteContactResponseSchema = GeneralResponseSchema;

export const IndexContactResponseSchema = BaseResponseSchema(ContactListSchema);

export const ShowContactResponseSchema = BaseResponseSchema(SingleContactSchema);

export const UpdateContactResponseSchema = BaseResponseSchema(SingleContactSchema);

export const ImportContactDataSchema = z.object({
    download_id: z.string().optional()
});
export const ImportContactResponseSchema = BaseResponseSchema(ImportContactDataSchema);
export type ImportContactResponse = z.infer<typeof ImportContactResponseSchema>;
