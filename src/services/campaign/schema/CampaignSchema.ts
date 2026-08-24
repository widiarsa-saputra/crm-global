import { z } from "zod";

export const UpdateCampaignSchema = z.object({
    template_id: z.union([z.string(), z.number()]).optional(),
    target_segment_id: z.union([z.string(), z.number()]).nullable().optional(),
    campaign_name: z.string().optional(),
    email_subject: z.string().optional(),
    date: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'processing', 'completed', 'failed']).optional(),
});

export type UpdateCampaignPayload = z.infer<typeof UpdateCampaignSchema>;

