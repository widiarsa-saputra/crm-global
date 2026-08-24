import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { privateApi } from "../../../api/api";
import { AxiosRequestConfig } from "axios";
import { ZodSchema } from "zod";

interface RequestConfig extends Partial<AxiosRequestConfig> {
    endpoint: string;
}

export interface QueryConfig<T> extends Omit<
    UseQueryOptions<T, unknown, T, string[]>,
    "queryFn" | "queryKey"
> {
    key: string;
}

interface UseBaseIndexProps<T> {
    request: RequestConfig;
    query: QueryConfig<T>;
    schema: ZodSchema<T>;
}

const buildQueryKey = (key: string, params?: Record<string, unknown>): string[] => {
    const entries = Object.entries(params || {}).map(([k, v]) => `${k}:${JSON.stringify(v)}`);
    return [key, ...entries];
};

const useBaseIndex = <T>({ request, query, schema }: UseBaseIndexProps<T>) => {
    const {
        endpoint,
        method = "get",
        params,
        headers,
        data,
        timeout = 5000,
        responseType = "json",
        ...axiosRest
    } = request;

    const queryKey = buildQueryKey(query.key, params);

    return useQuery<T, unknown, T, string[]>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await privateApi.request({
                    url: `/${endpoint}`,
                    method,
                    params,
                    data,
                    headers,
                    timeout,
                    responseType,
                    ...axiosRest,
                });

                const result = schema.safeParse(response.data);
                if (!result.success) {
                    console.error("Validation failed:", result.error.errors);
                    throw new Error("Invalid response data format");
                }

                return result.data;
            } catch (error) {
                console.error(`Failed to fetch ${query.key}`, error);
                throw error;
            }
        },
            // staleTime: 60 * 60 * 1000,
            // gcTime: 60 * 60 * 1000,
        ...query,
    });
};

export default useBaseIndex;
