import { z } from "zod";

export const CreateCampaignSchema = z.object({
    template_id: z.union([z.string(), z.number()]),
    segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    target_contact_ids: z.array(z.union([z.string(), z.number()])).optional(),
    campaign_name: z.string().min(1, "Campaign name is required"),
    email_subject: z.string().min(1, "Email subject is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().optional(),
    timezone: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'processing', 'completed', 'failed']).optional().default('draft'),
});

export const UpdateCampaignSchema = z.object({
    template_id: z.union([z.string(), z.number()]).optional(),
    segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    target_contact_ids: z.array(z.union([z.string(), z.number()])).optional(),
    campaign_name: z.string().optional(),
    email_subject: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    timezone: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'processing', 'completed', 'failed']).optional(),
});

export type CreateCampaignPayload = z.infer<typeof CreateCampaignSchema>;
export type UpdateCampaignPayload = z.infer<typeof UpdateCampaignSchema>;
