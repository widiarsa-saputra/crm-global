import { api } from '@/services/base/api';

export interface Campaign {
    id: number;
    template_id: number;
    target_segment_id: number | null;
    campaign_name: string;
    email_subject: string;
    date: string;
    status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'failed';
    open_rate: number;
    click_rate: number;
    created_at: string;
    updated_at: string;
    segment_name?: string; // Additional field for UI mapping
}

export const campaignService = {
    getAll: async () => {
        const response = await api.get<{ data: Campaign[] }>('/campaigns');
        return response.data.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Campaign>(`/campaigns/${id}`);
        return response.data;
    },
    create: async (data: Partial<Campaign>) => {
        const response = await api.post<Campaign>('/campaigns', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Campaign>) => {
        const response = await api.put<Campaign>(`/campaigns/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/campaigns/${id}`);
        return response.data;
    }
};
