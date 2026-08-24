import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../../../api/api";
import type { ZodSchema } from "zod";
import type { AxiosRequestConfig } from "axios";
import { GeneralRes } from "../response/BaseResponseSchema";

interface BaseCreateProps<T extends object, R> {
    endpoint: string;
    schema: ZodSchema<R>;
    contentType?: "application/json" | "multipart/form-data";
    queryKey: string;
    request?: AxiosRequestConfig;
    query?: {
        onMutate?: (variables: T) => Promise<{ previousData: unknown } | void> | { previousData: unknown } | void;
        onSuccess?: (data: R, variables: T, context: { previousData: unknown } | undefined) => void;
        onError?: (error: Error, variables: T, context: { previousData: unknown } | undefined) => void;
        onSettled?: (data: R | undefined, error: Error | null, variables: T, context: { previousData: unknown } | undefined) => void;
        retry?: number | boolean;
    };
}

export const useBaseCreate = <T extends object, R, Q extends {
    id: string | number;
}>({
    endpoint,
    schema,
    contentType = "application/json",
    request,
    query,
    queryKey
}: BaseCreateProps<T, R>) => {
    const queryClient = useQueryClient();
    type QueryData = GeneralRes & {
        data: Q[]
    }
    return useMutation<R, Error, T, { previousData: unknown }>({
        mutationFn: async (formData: T): Promise<R> => {
            let dataToSend: T | FormData = formData;
            const headers: Record<string, string> = {};

            if (contentType === "multipart/form-data") {
                const formDataObject = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (value instanceof File) {
                            formDataObject.append(key, value);
                        } else if (Array.isArray(value)) {
                            value.forEach(item => formDataObject.append(`${key}[]`, String(item)));
                        } else {
                            formDataObject.append(key, String(value));
                        }
                    }
                });
                dataToSend = formDataObject;
                headers["Content-Type"] = "multipart/form-data";
            } else {
                headers["Content-Type"] = "application/json";
            }

            const response = await privateApi.post(`/${endpoint}`, dataToSend, {
                headers,
                ...request,
            });

            return response.data;
        },

        onMutate: async (form) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] });
            const previousData = queryClient.getQueryData<R>([queryKey]);
            queryClient.setQueriesData({ queryKey: [queryKey] }, (oldPost: unknown) => {
                const old = oldPost as QueryData | undefined;
                if(!old) return previousData;
                return {
                    ...old,
                    data: [form as unknown as Q, ...old.data]
                }
            });

            if (query?.onMutate) {
                await query.onMutate(form);
            }

            return { previousData };
        },

        onSuccess: async (data, variables, context) => {
            try {
                const validationResult = schema.safeParse(data);
                if (!validationResult.success) {
                    console.error("Validation failed:", validationResult.error.errors);
                    throw new Error(`Invalid ${endpoint} data format`);
                }

                if (query?.onSuccess) {
                    query.onSuccess(validationResult.data, variables, context);
                }
                return validationResult.data;
            } catch (error) {
                console.error(`Failed to validate ${endpoint}`, error);
                throw error;
            }
        },

        onError: (error, variables, context) => {
            console.error(`Failed to create ${endpoint}`, error);
            
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueriesData({ queryKey: [queryKey] }, context.previousData);
            }
            
            if (query?.onError) {
                query.onError(error, variables, context);
            }
            throw error;
        },
        
        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: [queryKey]
            });
            
            if (query?.onSettled) {
                query.onSettled(data, error, variables, context);
            }
        },

        retry: query?.retry,
    });
};