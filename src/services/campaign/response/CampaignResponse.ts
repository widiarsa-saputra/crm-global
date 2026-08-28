import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleContactSchema } from "@/services/contacts/response/ContactsResponse";

export const CampaignContactSchema = z.object({
    id: z.union([z.string(), z.number()]),
    campaign_id: z.union([z.string(), z.number()]),
    contact_id: z.union([z.string(), z.number()]),
    contact_name: z.string().optional(),
    email: z.string().optional(),
    contact_email: z.string().optional(),
    status: z.string().optional(),
    send_status: z.string().optional(),
    opened_at: z.string().nullable().optional(),
    is_open: z.boolean().optional(),
    is_clicked: z.boolean().optional(),
    sent_at: z.string().nullable().optional(),
    clicked_at: z.string().nullable().optional(),
    error_message: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    contact: SingleContactSchema.optional(),
});

export const SingleCampaignSchema = z.object({
    id: z.union([z.string(), z.number()]),
    template_id: z.union([z.string(), z.number()]).nullable().optional(),
    template_message: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    file_id: z.any().nullable().optional(),
    segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    target_contact_id: z.union([z.string(), z.number()]).nullable().optional(),
    campaign_name: z.string(),
    email_subject: z.string(),
    date: z.string(),
    status: z.enum(['draft', 'processing', 'completed', 'failed']),
    time: z.string().nullable().optional(),
    timezone: z.string().nullable().optional(),
    open_rate: z.coerce.number().optional().default(0),
    click_rate: z.coerce.number().optional().default(0),
    sent: z.coerce.number().optional().default(0),
    delivered: z.coerce.number().optional().default(0),

    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    segment_name: z.string().nullable().optional(),
    campaign_contacts: CampaignContactSchema.array().optional()
});

export const SingleCampaignResponseSchema = BaseResponseSchema(SingleCampaignSchema);
export type SingleCampaignResponseWrapped = z.infer<typeof SingleCampaignResponseSchema>;
export const CampaignListSchema = z.array(SingleCampaignSchema);
export const IndexCampaignResponseSchema = BaseResponseSchema(CampaignListSchema);
export type IndexCampaignResponse = z.infer<typeof IndexCampaignResponseSchema>;
export type SingleCampaignResponse = z.infer<typeof SingleCampaignSchema>;
export const CampaignContactListSchema = z.array(CampaignContactSchema);
export const IndexCampaignContactResponseSchema = BaseResponseSchema(CampaignContactListSchema);
export type IndexCampaignContactResponse = z.infer<typeof IndexCampaignContactResponseSchema>;
export type SingleCampaignContactResponse = z.infer<typeof CampaignContactSchema>;
