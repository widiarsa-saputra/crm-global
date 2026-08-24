// src/auth/hooks/useUser.ts

import { useQuery } from '@tanstack/react-query';
import { privateApi } from '../../api/api';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';
import { LoginData } from '../response/loginResponseSchema';

interface MeResponse {
    data: LoginData;
}

export const useUser = () => {
    const { relogin, isAuthenticated } = useAuth();

    const query = useQuery({
        // Gunakan key yang lebih spesifik dan bergantung pada status auth
        queryKey: ['auth', 'me'],
        queryFn: async (): Promise<MeResponse> => {
            const response = await privateApi.get<MeResponse>('/v3/me');
            return response.data;
        },
        // Query ini hanya akan berjalan jika user sudah login (punya token)
        enabled: isAuthenticated,
        // Opsi lain yang berguna:
        staleTime: 1000 * 60 * 5, // Cache data user selama 5 menit
        retry: 1, // Hanya coba lagi 1 kali jika gagal
    });

    // PISAHKAN SIDE EFFECT DARI QUERY FUNCTION
    useEffect(() => {
        // Jika query berhasil dan mendapatkan data baru
        if (query.isSuccess && query.data) {
            // Gunakan `relogin` untuk update data user tanpa mengubah token
            relogin(query.data.data);
        }
    }, [query.isSuccess, query.data, relogin]);

    return query;
};