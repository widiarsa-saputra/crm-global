// src/auth/hooks/useLogin.ts

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { publicApi } from '../../api/api';
import { useAuth } from '../context/AuthProvider';
import { ApiLoginPayload } from '../schema/loginDataSchema'; // PERBAIKAN: Hanya impor tipe yang digunakan
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios'; // PERBAIKAN: Hanya impor tipe yang digunakan
import { LoginData as UserData } from '../response/loginResponseSchema';
import { getRedirectPath } from '../utils/utils';

type LoginVariables = ApiLoginPayload;

// Definisikan default mutationFn
const defaultMutationFn = async (data: LoginVariables) => {
    const res = await publicApi.post<any>('/v1/login', data);
    return res.data;
};

// Tipe untuk hasil transformasi, yang dibutuhkan oleh fungsi login
interface TransformedAuthData {
    user: UserData;
    token: string;
}

// Tipe untuk opsi kustomisasi
interface UseLoginOptions<TResponse = unknown> {
    transformResponse?: (response: TResponse) => TransformedAuthData;
    mutationFn?: (variables: LoginVariables) => Promise<TResponse>;
    mutationOptions?: Omit<UseMutationOptions<TransformedAuthData, AxiosError, LoginVariables>, 'mutationFn'>;
}

// Default transformer jika API sudah sesuai dengan schema
const defaultTransformResponse = (response: any): TransformedAuthData => {
    return {
        user: response.data,
        token: response.token,
    };
};

export const useLogin = <TResponse = any>(options?: UseLoginOptions<TResponse>) => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        transformResponse = defaultTransformResponse,
        mutationOptions,
        mutationFn = defaultMutationFn,
    } = options ?? {};

    return useMutation<TransformedAuthData, AxiosError, LoginVariables>({
        mutationFn: async (data) => {
            const response = await mutationFn(data);
            return transformResponse(response);
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            const { roles = [], permissions = [] } = data.user;
            const redirectPath = getRedirectPath(roles, permissions);
            navigate(redirectPath);
        },
        ...mutationOptions,
    });
};