import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    TryoutSubtestCreatePayload,
    TryoutSubtestUpdatePayload,
    TryoutSubtestEntity,
} from "../schema/TryoutSubtestSchema";
import {
    TryoutSubtestListResponseSchema,
    TryoutSubtestCreateResponseSchema,
    TryoutSubtestUpdateResponseSchema,
    TryoutSubtestShowResponseSchema,
    TryoutSubtestListResponse,
    TryoutSubtestShowResponse,
    TryoutSubtestCreateResponse,
    TryoutSubtestUpdateResponse,
} from "../response/TryoutSubtestResponse";

const API_VERSION = "v1";
const queryKey = "tryout-subtests";

export const useTryoutSubtestIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<TryoutSubtestListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: TryoutSubtestListResponseSchema,
        query: { key: queryKey },
    });
};

export const useTryoutSubtestShow = (id: string | number) => {
    return useBaseShow<TryoutSubtestShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: TryoutSubtestShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useTryoutSubtestCreate = () => {
    return useBaseCreate<TryoutSubtestCreatePayload, TryoutSubtestCreateResponse, TryoutSubtestEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutSubtestCreateResponseSchema,
        queryKey,
    });
};

export const useTryoutSubtestUpdate = () => {
    return useBaseUpdate<TryoutSubtestUpdatePayload, TryoutSubtestUpdateResponse, TryoutSubtestEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutSubtestUpdateResponseSchema,
        queryKey,
    });
};

export const useTryoutSubtestDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, TryoutSubtestEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
