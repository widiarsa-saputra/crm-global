import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    TryoutQuestionCreatePayload,
    TryoutQuestionEntity,
    TryoutQuestionUpdatePayload,
} from "../schema/TryoutQuestionSchema";
import {
    TryoutQuestionListResponseSchema,
    TryoutQuestionCreateResponseSchema,
    TryoutQuestionUpdateResponseSchema,
    TryoutQuestionShowResponseSchema,
    TryoutQuestionListResponse,
    TryoutQuestionShowResponse,
    TryoutQuestionCreateResponse,
    TryoutQuestionUpdateResponse,
} from "../response/TryoutQuestionResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "tryout-questions";
const API_VERSION = "v1";

export const useTryoutQuestionIndex = (params?: object) => {
    return useBaseIndex<TryoutQuestionListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: TryoutQuestionListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useTryoutQuestionShow = (id: string | number, params?: object) => {
    return useBaseShow<TryoutQuestionShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params,
        },
        schema: TryoutQuestionShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useTryoutQuestionCreate = () => {
    return useBaseCreate<TryoutQuestionCreatePayload, TryoutQuestionCreateResponse, TryoutQuestionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutQuestionCreateResponseSchema,
        queryKey,
    });
};

export const useTryoutQuestionUpdate = () => {
    return useBaseUpdate<TryoutQuestionUpdatePayload, TryoutQuestionUpdateResponse, TryoutQuestionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TryoutQuestionUpdateResponseSchema,
        queryKey,
    });
};

export const useTryoutQuestionDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, TryoutQuestionEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
