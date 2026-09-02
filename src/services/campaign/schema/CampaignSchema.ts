import { z } from "zod";
import { optionalTrimmedString } from "@/lib/zod";

export const CreateCampaignSchema = z.object({
    file_id: z.any().nullable().optional(),
    message: z.string().optional(),
    target_segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    campaign_contacts: z.array(z.object({
        contact_id: z.union([z.string(), z.number()]),
        contact_name: z.string().optional(),
        contact_email: z.string().optional()
    })).optional(),
    campaign_name: z.string().min(1, "Campaign name is required"),
    email_subject: z.string().min(1, "Email subject is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().optional(),
    timezone: z.string().optional(),
    status: z.enum(['draft', 'processing', 'completed', 'failed']).optional().default('draft'),
});

export const UpdateCampaignSchema = z.object({
    file_id: z.any().nullable().optional(),
    message: optionalTrimmedString(),
    target_segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    target_contact_ids: z.array(z.union([z.string(), z.number()])).optional(),
    campaign_name: optionalTrimmedString(),
    email_subject: optionalTrimmedString(),
    date: optionalTrimmedString(),
    time: optionalTrimmedString(),
    timezone: optionalTrimmedString(),
    campaign_contacts: z.array(z.object({
        contact_id: z.union([z.string(), z.number()]),
        contact_name: z.string().optional(),
        contact_email: z.string().optional()
    })).optional(),
    status: z.enum(['draft', 'processing', 'completed', 'failed']).optional(),
});

export type CreateCampaignPayload = z.infer<typeof CreateCampaignSchema>;
export type UpdateCampaignPayload = z.infer<typeof UpdateCampaignSchema>;
