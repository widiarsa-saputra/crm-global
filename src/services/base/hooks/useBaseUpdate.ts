import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../../../api/api";
import type { ZodSchema } from "zod";
import type { AxiosRequestConfig } from "axios";
import { GeneralRes } from "../response/BaseResponseSchema";

type DataForm<T extends object> = {
    id: string | number,
    data: T
}

interface BaseUpdateProps<T extends object, R> {
    endpoint: string | ((params: DataForm<T>) => string);
    schema: ZodSchema<R>;
    contentType?: "application/json" | "multipart/form-data";
    queryKey: string;
    request?: AxiosRequestConfig;
    query?: {
        onMutate?: (variables: DataForm<T>) => Promise<{ previousData: unknown } | void> | { previousData: unknown } | void;
        onSuccess?: (data: R, variables: DataForm<T>, context: { previousData: unknown } | undefined) => void;
        onError?: (error: Error, variables: DataForm<T>, context: { previousData: unknown } | undefined) => void;
        onSettled?: (data: R | undefined, error: Error | null, variables: DataForm<T>, context: { previousData: unknown } | undefined) => void;
        retry?: number | boolean;
    };
}

export const useBaseUpdate = <T extends object, R, Q extends { id: string | number }>({
    endpoint,
    schema,
    contentType = "application/json",
    request,
    queryKey,
    query
}: BaseUpdateProps<T, R>) => {
    const queryClient = useQueryClient();

    type Form = DataForm<T>;
    type QueryData = GeneralRes & {
        data: Q[]
    };

    return useMutation<R, Error, Form, { previousData: unknown }>({
        mutationFn: async (params: Form): Promise<R> => {
            const url = typeof endpoint === "function" ? endpoint(params) : `${endpoint}/${params.id}`;

            let dataToSend: T | FormData = params.data

            const headers: Record<string, string> = {};

            if (contentType === "multipart/form-data") {
                const formDataObject = new FormData();
                Object.entries(dataToSend).forEach(([key, value]) => {
                    if (value instanceof File) {
                        formDataObject.append(key, value);
                    } else if (Array.isArray(value)) {
                        value.forEach(item => formDataObject.append(`${key}[]`, String(item)));
                    } else {
                        formDataObject.append(key, String(value));
                    }
                });
                dataToSend = formDataObject;
                headers["Content-Type"] = "multipart/form-data";
            } else {
                headers["Content-Type"] = "application/json";
            }

            const response = await privateApi.put(`/${url}`, dataToSend, {
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
                if (!old) return previousData;
                return {
                    ...old,
                    data: old.data.map((post) =>
                        post.id === form.id
                            ? { ...post, ...(form.data as unknown as Partial<Q>) }
                            : post
                    )
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
            console.error(`Failed to update ${endpoint}`, error);
            
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