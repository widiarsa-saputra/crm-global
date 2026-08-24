import { api } from '@/services/base/api';

export interface Segment {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export const segmentService = {
    getAll: async () => {
        const response = await api.get<Segment[]>('/segments');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<Segment>(`/segments/${id}`);
        return response.data;
    },
    create: async (data: { name: string }) => {
        const response = await api.post<Segment>('/segments', data);
        return response.data;
    },
    update: async (id: string, data: { name: string }) => {
        const response = await api.put<Segment>(`/segments/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/segments/${id}`);
        return response.data;
    }
};
