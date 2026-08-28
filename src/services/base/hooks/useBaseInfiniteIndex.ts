import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { privateApi } from "../../../../../crm-global/src/api/api";
import { AxiosRequestConfig } from "axios";

import { BaseResponse } from "../../../../../crm-global/src/services/base/response/BaseResponseSchema";

interface RequestConfig extends Partial<AxiosRequestConfig> {
    endpoint: string;
}

export interface InfiniteQueryConfig<T> extends Omit<
    UseInfiniteQueryOptions<T, Error, import("@tanstack/react-query").InfiniteData<T>, string[], number>,
    "queryFn" | "queryKey" | "initialPageParam" | "getNextPageParam"
> {
    key: string;
}

import { ZodType, ZodTypeDef } from "zod";

interface UseBaseInfiniteIndexProps<T> {
    request: RequestConfig;
    query: InfiniteQueryConfig<T>;
    schema: ZodType<T, ZodTypeDef, unknown>;
}

const buildQueryKey = (key: string, params?: Record<string, unknown>): string[] => {
    const entries = Object.entries(params || {}).map(([k, v]) => `${k}:${JSON.stringify(v)}`);
    return [key, ...entries];
};

interface PaginatedResponse {
    pagination?: {
        current_page: number;
        last_page: number;
    } | null;
}

const useBaseInfiniteIndex = <T extends BaseResponse<unknown> & PaginatedResponse>({ request, query, schema }: UseBaseInfiniteIndexProps<T>) => {
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

    return useInfiniteQuery<T, Error, import("@tanstack/react-query").InfiniteData<T>, string[], number>({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            try {
                const response = await privateApi.request({
                    url: `/${endpoint}`,
                    method,
                    params: {
                        ...params,
                        page: pageParam,
                    },
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

                return result.data as T;
            } catch (error) {
                console.error(`Failed to fetch infinite ${query.key}`, error);
                throw error;
            }
        },
        getNextPageParam: (lastPage: T) => {
            const pagination = lastPage.pagination;
            if (pagination && pagination.current_page < pagination.last_page) {
                return pagination.current_page + 1;
            }
            return undefined;
        },
        ...query,
    });
};

export default useBaseInfiniteIndex;
