import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const DashboardSummarySchema = z.object({
    active_contacts: z.number(),
    total_campaigns_sent: z.number(),
    avg_open_rate: z.number(),
    avg_click_rate: z.number(),
});

export const EngagementPerSegmentSchema = z.object({
    segment_name: z.string().nullable().optional(),
    open_rate_pct: z.string(),
    click_rate_pct: z.string(),
});

export const ContactDistributionSchema = z.object({
    segment_name: z.string().nullable().optional(),
    total_contact: z.number(),
});

export const RecentBlastCampaignSchema = z.object({
    id: z.string(),
    template_id: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    target_segment_id: z.string().nullable().optional(),
    campaign_name: z.string(),
    email_subject: z.string(),
    date: z.string(),
    time: z.string().nullable().optional(),
    timezone: z.string().nullable().optional(),
    status: z.string(),
    open_rate: z.coerce.number(),
    click_rate: z.coerce.number(),
    created_at: z.string(),
    updated_at: z.string(),
    segment_name: z.string().nullable().optional(),
});

export const TopContactSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    email: z.string(),
    engagement: z.number(),
    opens: z.number(),
    clicks: z.number(),
});

export const DashboardDataSchema = z.object({
    summary: DashboardSummarySchema,
    engagement_per_segment: z.array(EngagementPerSegmentSchema),
    contact_distribution: z.array(ContactDistributionSchema),
    recent_blast_campaigns: z.array(RecentBlastCampaignSchema),
    top_contacts: z.array(TopContactSchema).optional(),
});

export const DashboardResponseSchema = BaseResponseSchema(DashboardDataSchema);

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type EngagementPerSegment = z.infer<typeof EngagementPerSegmentSchema>;
export type ContactDistribution = z.infer<typeof ContactDistributionSchema>;
export type RecentBlastCampaign = z.infer<typeof RecentBlastCampaignSchema>;
export type DashboardResponse = z.infer<typeof DashboardDataSchema>;
export type DashboardResponseWrapped = z.infer<typeof DashboardResponseSchema>;
