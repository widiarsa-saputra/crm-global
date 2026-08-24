import { api } from '@/services/base/api';

export interface CampaignContact {
    id: number;
    campaign_id: number;
    contact_id: number;
    status: 'queued' | 'sent' | 'failed';
    is_open: boolean;
    is_clicked: boolean;
    opened_at: string | null;
    clicked_at: string | null;
    sent_at: string | null;
    error_message: string | null;
    contact_name?: string;
    contact_email?: string;
}

export const campaignContactService = {
    getByCampaignId: async (campaignId: number) => {
        const response = await api.get<{ data: CampaignContact[] }>(`/campaigns/${campaignId}/contacts`);
        return response.data.data;
    },
};
