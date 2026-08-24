// src/api/api.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
// Import authService yang sudah kita buat
import { authService } from '@/auth/services/authService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for retry logic
const retryRequest = async (config: InternalAxiosRequestConfig, retries: number = 3, delay: number = 5000): Promise<AxiosResponse> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios(config);
        } catch (error: any) {
            // Only retry for timeout or network errors
            if ((error.code === 'ECONNABORTED' || error.message.includes('timeout') || !error.response) && i < retries - 1) {
                console.warn(`Retry attempt ${i + 1} for request: ${config.url}`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Max retries exceeded');
};

// Setup Public API instance (No auth required)
const publicApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Setup Private API instance (Auth required)
const privateApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests for Private API
privateApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Ambil token dari authService, bukan localStorage langsung
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Import global queryClient
import { queryClient } from '../lib/queryClient';

// Intercept responses for Private API
privateApi.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        // Handle token expiration or unauthorized access
        if (error.response?.status === 401) {
            // Gunakan authService untuk membersihkan seluruh sesi (token dan data user)
            authService.clearSession();
            // Redirect ke halaman login. Ini adalah pendekatan yang simpel dan efektif.
            window.location.href = '/authentication';
        }

        // RE-FETCH /ME ON 403 (FORBIDDEN)
        // Ini dipicu jika user mencoba akses sesuatu yang hak aksesnya baru saja dicabut.
        if (error.response?.status === 403) {
            console.warn('Access forbidden (403). Re-fetching user state...');
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        }

        // Handle request timeout with retry
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout, attempting retry:', error.message);
            try {
                // Retry the request
                return await retryRequest(error.config);
            } catch (retryError) {
                console.error('Retry failed:', retryError);
                // Anda bisa menampilkan notifikasi ke user
                // Contoh: alert('Request timed out after retries. Please try again.');
            }
        }
        return Promise.reject(error);
    }
);

export { publicApi, privateApi };