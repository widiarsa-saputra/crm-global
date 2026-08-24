import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    TryoutAttemptCreatePayload,
    TryoutAttemptEntity,
    TryoutAttemptUpdatePayload,
} from "../schema/TryoutAttemptSchema";
import {
    TryoutAttemptListResponseSchema,
    TryoutAttemptCreateResponseSchema,
    TryoutAttemptUpdateResponseSchema,
    TryoutAttemptShowResponseSchema,
    TryoutAttemptListResponse,
    TryoutAttemptShowResponse,
    TryoutAttemptCreateResponse,
    TryoutAttemptUpdateResponse,
} from "../response/TryoutAttemptResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "tryout-attempts";
const API_VERSION = "v1";

export const useTryoutAttemptIndex = (params?: object) => {
    return useBaseIndex<TryoutAttemptListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: TryoutAttemptListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useTryoutAttemptShow = (id: string | number, params?: object) => {
    return useBaseShow<TryoutAttemptShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params,
        },
        schema: TryoutAttemptShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useTryoutAttemptCreate = () => {
    return useBaseCreate<TryoutAttemptCreatePayload, TryoutAttemptCreateResponse, TryoutAttemptEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutAttemptCreateResponseSchema,
        queryKey,
    });
};

export const useTryoutAttemptUpdate = () => {
    return useBaseUpdate<TryoutAttemptUpdatePayload, TryoutAttemptUpdateResponse, TryoutAttemptEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutAttemptUpdateResponseSchema,
        queryKey,
    });
};

export const useTryoutAttemptDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, TryoutAttemptEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
