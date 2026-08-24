import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { privateApi } from "../../../api/api";
import { ZodSchema } from "zod";
import type { AxiosRequestConfig } from "axios";

interface RequestConfig extends Partial<AxiosRequestConfig> {
    endpoint: string;
    id: string;
}

interface QueryConfig<T> extends Omit<
    UseQueryOptions<T, unknown, T, any[]>,
    "queryKey" | "queryFn"
> {
    key: string;
}

interface UseBaseShowProps<T> {
    request: RequestConfig;
    query?: QueryConfig<T>;
    schema: ZodSchema<T>;
}

const useBaseShow = <T>({
    request,
    query,
    schema,
}: UseBaseShowProps<T>) => {
    const { endpoint, id, params, headers, ...restRequest } = request;

    // Build queryKey unik
    const queryKey = [
        query?.key,
        id,
        ...(params ? Object.entries(params).map(([k, v]) => `${k}:${v}`) : []),
    ];

    return useQuery({
        queryKey,
        enabled: query?.enabled ?? !!id,
        retry: query?.retry ?? import.meta.env.VITE_MAX_RETRY,
        refetchOnWindowFocus: query?.refetchOnWindowFocus ?? false,
        ...query, // spread sisa query options (select, onSuccess, dll)
        queryFn: async () => {
            if (!id) throw new Error("ID is required");

            try {
                const response = await privateApi.get(`/${endpoint}/${id}`, {
                    params,
                    headers,
                    ...restRequest,
                });

                const validationResult = schema.safeParse(response.data);
                if (!validationResult.success) {
                    console.error(
                        `Validation failed for ${query?.key}:`,
                        validationResult.error.errors
                    );
                    throw new Error(`Invalid ${query?.key} data format`);
                }

                return validationResult.data;
            } catch (error) {
                console.error(`Failed to fetch ${query?.key} details`, error);
                throw error;
            }
        },
    });
};

export default useBaseShow;
