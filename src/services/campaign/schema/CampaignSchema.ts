import { z } from "zod";
import { optionalTrimmedString } from "@/lib/zod";

export const CreateCampaignSchema = z.object({
    template_id: z.union([z.string(), z.number()]).nullable().optional(),
    message: z.string().optional(),
    campaign_contacts: z.array(z.object({
        contact_id: z.union([z.string(), z.number()])
    })).optional(),
    campaign_name: z.string().min(1, "Campaign name is required"),
    email_subject: z.string().min(1, "Email subject is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().optional(),
    timezone: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'processing', 'completed', 'failed']).optional().default('draft'),
});

export const UpdateCampaignSchema = z.object({
    template_id: z.union([z.string(), z.number()]).nullable().optional(),
    message: optionalTrimmedString(),
    segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    target_contact_ids: z.array(z.union([z.string(), z.number()])).optional(),
    campaign_name: optionalTrimmedString(),
    email_subject: optionalTrimmedString(),
    date: optionalTrimmedString(),
    time: optionalTrimmedString(),
    timezone: optionalTrimmedString(),
    campaign_contacts: z.array(z.object({
        contact_id: z.union([z.string(), z.number()])
    })).optional(),
    status: z.enum(['draft', 'scheduled', 'processing', 'completed', 'failed']).optional(),
});

export type CreateCampaignPayload = z.infer<typeof CreateCampaignSchema>;
export type UpdateCampaignPayload = z.infer<typeof UpdateCampaignSchema>;
