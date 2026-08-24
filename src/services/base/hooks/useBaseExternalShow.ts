import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { ZodSchema } from "zod";

interface RequestConfig extends Partial<AxiosRequestConfig> {
    endpoint: string;
    id: string;
    baseURL: string;
}

interface QueryConfig<T> extends Omit<
    UseQueryOptions<T, unknown, T, any[]>,
    "queryKey" | "queryFn"
> {
    key: string;
}

interface UseBaseExternalShowProps<T> {
    request: RequestConfig;
    query?: QueryConfig<T>;
    schema: ZodSchema<T>;
}

const useBaseExternalShow = <T>({
    request,
    query,
    schema,
}: UseBaseExternalShowProps<T>) => {
    const { endpoint, id, baseURL, params, headers, ...restRequest } = request;

    const queryKey = [
        query?.key,
        id,
        ...(params ? Object.entries(params).map(([k, v]) => `${k}:${v}`) : []),
    ];

    return useQuery({
        queryKey,
        enabled: query?.enabled ?? !!id,
        retry: query?.retry ?? 0,
        refetchOnWindowFocus: query?.refetchOnWindowFocus ?? false,
        ...query,
        queryFn: async () => {
            if (!id) throw new Error("ID is required");

            try {
                const response = await axios.get(`${baseURL}/${endpoint}/${id}`, {
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

export default useBaseExternalShow;
