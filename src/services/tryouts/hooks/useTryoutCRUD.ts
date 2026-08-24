import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    TryoutCreatePayload,
    TryoutEntity,
    TryoutUpdatePayload,
} from "../schema/TryoutSchema";
import {
    TryoutListResponseSchema,
    TryoutCreateResponseSchema,
    TryoutUpdateResponseSchema,
    TryoutShowResponseSchema,
    TryoutListResponse,
    TryoutShowResponse,
    TryoutCreateResponse,
    TryoutUpdateResponse,
} from "../response/TryoutResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "tryouts";
const API_VERSION = "v1";

export const useTryoutIndex = (params?: object) => {
    return useBaseIndex<TryoutListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: TryoutListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useTryoutShow = (id: string | number, params?: object) => {
    return useBaseShow<TryoutShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params,
        },
        schema: TryoutShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useTryoutCreate = () => {
    return useBaseCreate<TryoutCreatePayload, TryoutCreateResponse, TryoutEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutCreateResponseSchema,
        queryKey,
    });
};

export const useTryoutUpdate = () => {
    return useBaseUpdate<TryoutUpdatePayload, TryoutUpdateResponse, TryoutEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutUpdateResponseSchema,
        queryKey,
    });
};

export const useTryoutDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, TryoutEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
