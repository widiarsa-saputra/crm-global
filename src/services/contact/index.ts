import { api } from '@/services/base/api';
import { Segment } from '../segment';

export interface Contact {
    id: string;
    segment_id: string | null;
    nama: string;
    email: string;
    company: string | null;
    email_status: 'valid' | 'invalid' | 'bounced' | 'unsubscribed';
    created_at: string;
    updated_at: string;
    segment?: Segment;
}

export const contactService = {
    getAll: async (params?: { segment_id?: string; search?: string; page?: number }) => {
        const response = await api.get<{ data: Contact[], total: number }>('/contacts', { params });
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<Contact>(`/contacts/${id}`);
        return response.data;
    },
    create: async (data: Partial<Contact>) => {
        const response = await api.post<Contact>('/contacts', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Contact>) => {
        const response = await api.put<Contact>(`/contacts/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    }
};
