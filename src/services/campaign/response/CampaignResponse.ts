import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleContactSchema } from "@/services/contacts";

export const SingleCampaignSchema = z.object({
    id: z.union([z.string(), z.number()]),
    template_id: z.union([z.string(), z.number()]),
    template_message: z.string().optional(),
    segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    target_contact_id: z.union([z.string(), z.number()]).nullable().optional(),
    campaign_name: z.string(),
    email_subject: z.string(),
    date: z.string(),
    status: z.enum(['draft', 'scheduled', 'processing', 'completed', 'failed']),
    time: z.string().nullable().optional(),
    timezone: z.string().nullable().optional(),
    open_rate: z.coerce.number().optional().default(0),
    click_rate: z.coerce.number().optional().default(0),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    segment_name: z.string().optional(),
    target_contacts: z.array(SingleContactSchema.extend({
        send_status: z.string().optional(),
        open_time: z.string().optional()
    })).optional()
});

export const CampaignListSchema = z.array(SingleCampaignSchema);
export const IndexCampaignResponseSchema = BaseResponseSchema(CampaignListSchema);
export type IndexCampaignResponse = z.infer<typeof IndexCampaignResponseSchema>;
export type SingleCampaignResponse = z.infer<typeof SingleCampaignSchema>;
