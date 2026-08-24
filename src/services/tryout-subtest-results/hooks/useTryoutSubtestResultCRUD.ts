import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import {
    TryoutSubtestResultListResponseSchema,
    TryoutSubtestResultShowResponseSchema,
    TryoutSubtestResultListResponse,
    TryoutSubtestResultShowResponse,
    TryoutSubtestResultMutationResponseSchema,
    TryoutSubtestResultMutationResponse,
} from "../response/TryoutSubtestResultResponse";
import { 
    TryoutSubtestResultCreatePayload, 
    TryoutSubtestResultUpdatePayload,
    TryoutSubtestResultEntity
} from "../schema/TryoutSubtestResultSchema";

const API_VERSION = "v1";
const queryKey = "tryout-subtest-results";

export const useTryoutSubtestResultIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<TryoutSubtestResultListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: TryoutSubtestResultListResponseSchema,
        query: { key: queryKey },
    });
};

export const useTryoutSubtestResultShow = (id: string | number) => {
    return useBaseShow<TryoutSubtestResultShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: TryoutSubtestResultShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useTryoutSubtestResultCreate = () => {
    return useBaseCreate<TryoutSubtestResultCreatePayload, TryoutSubtestResultMutationResponse, TryoutSubtestResultEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutSubtestResultMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useTryoutSubtestResultUpdate = () => {
    return useBaseUpdate<TryoutSubtestResultUpdatePayload, TryoutSubtestResultMutationResponse, TryoutSubtestResultEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: TryoutSubtestResultMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useTryoutSubtestResultDelete = () => {
    return useBaseDelete<{ id: string | number }, TryoutSubtestResultMutationResponse, TryoutSubtestResultEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: TryoutSubtestResultMutationResponseSchema,
        queryKey: queryKey,
    });
};
