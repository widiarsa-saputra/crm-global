// src/auth/hooks/useRegister.ts

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { publicApi } from '../../api/api';
import { AxiosError } from 'axios';
import { RegisterPayload } from '../schema/registerSchemas';

type RegisterVariables = RegisterPayload;
type RegisterResponse = unknown;

interface UseRegisterOptions {
    mutationOptions?: Omit<
        UseMutationOptions<RegisterResponse, AxiosError, RegisterVariables>,
        'mutationFn'
    >;
}

const registerMutationFn = async (data: RegisterVariables): Promise<RegisterResponse> => {
    const res = await publicApi.post('/v1/register', data);
    return res.data;
};

export const useRegister = (options?: UseRegisterOptions) => {
    return useMutation<RegisterResponse, AxiosError, RegisterVariables>({
        mutationFn: registerMutationFn,
        ...options?.mutationOptions,
    });
};
