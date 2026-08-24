import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    TryoutAttemptAnswerCreatePayload,
    TryoutAttemptAnswerUpdatePayload,
    TryoutAttemptAnswerEntity,
} from "../schema/TryoutAttemptAnswerSchema";
import {
    TryoutAttemptAnswerListResponseSchema,
    TryoutAttemptAnswerCreateResponseSchema,
    TryoutAttemptAnswerUpdateResponseSchema,
    TryoutAttemptAnswerShowResponseSchema,
    TryoutAttemptAnswerListResponse,
    TryoutAttemptAnswerShowResponse,
    TryoutAttemptAnswerCreateResponse,
    TryoutAttemptAnswerUpdateResponse,
} from "../response/TryoutAttemptAnswerResponse";

const API_VERSION = "v1";
const queryKey = "tryout-attempt-answers";

export const useTryoutAttemptAnswerIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<TryoutAttemptAnswerListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: TryoutAttemptAnswerListResponseSchema,
        query: { key: queryKey },
    });
};

export const useTryoutAttemptAnswerShow = (id: string | number) => {
    return useBaseShow<TryoutAttemptAnswerShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: TryoutAttemptAnswerShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useTryoutAttemptAnswerCreate = () => {
    return useBaseCreate<TryoutAttemptAnswerCreatePayload, TryoutAttemptAnswerCreateResponse, TryoutAttemptAnswerEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutAttemptAnswerCreateResponseSchema,
        queryKey,
    });
};

export const useTryoutAttemptAnswerUpdate = () => {
    return useBaseUpdate<TryoutAttemptAnswerUpdatePayload, TryoutAttemptAnswerUpdateResponse, TryoutAttemptAnswerEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutAttemptAnswerUpdateResponseSchema,
        queryKey,
    });
};

export const useTryoutAttemptAnswerDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, TryoutAttemptAnswerEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
