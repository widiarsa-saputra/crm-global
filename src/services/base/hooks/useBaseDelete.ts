import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { privateApi } from "../../../api/api";
import { ZodSchema } from "zod";
import { GeneralRes } from "../response/BaseResponseSchema";

interface BaseDeleteProps<T extends { id: string | number }, R> {
    endpoint: string | ((params: T) => string);
    schema: ZodSchema<R>;
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

export const useBaseDelete = <T extends { id: string | number }, R, Q extends { id: string | number }>({
    endpoint,
    schema,
    queryKey,
    request,
    query,
}: BaseDeleteProps<T, R>) => {
    const queryClient = useQueryClient();

    type QueryData = GeneralRes & {
        data: Q[]
    };

    return useMutation<R, Error, T, { previousData: unknown }>({
        mutationFn: async (params: T): Promise<R> => {
            const url = typeof endpoint === "function" ? endpoint(params) : endpoint;
            const response: AxiosResponse = await privateApi.delete(url, {
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
                    data: old.data.filter((post) => post.id !== form.id)
                };
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
                    throw new Error(`Invalid data format`);
                }
                
                // Nuclear Approach: Musnahkan semua cache yang memiliki elemen array persis dengan ID ini
                queryClient.removeQueries({
                    predicate: (q) => 
                        q.queryKey.includes(variables.id) || 
                        q.queryKey.includes(String(variables.id))
                });
                
                if (query?.onSuccess) {
                    query.onSuccess(validationResult.data, variables, context);
                }
                return validationResult.data;
            } catch (error) {
                console.error("Failed to parse delete response", error);
                throw error;
            }
        },

        onError: (error, variables, context) => {
            console.error("Failed to delete", error);
            
            if (context?.previousData) {
                queryClient.setQueriesData({ queryKey: [queryKey] }, context.previousData);
            }
            
            if (query?.onError) {
                query.onError(error, variables, context);
            }
            throw error;
        },

        onSettled: (data, error, variables, context) => {
            if (query?.onSettled) {
                query.onSettled(data, error, variables, context);
            }
        },

        retry: query?.retry,
    });
};
