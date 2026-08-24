import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    QuestionOptionCreatePayload,
    QuestionOptionUpdatePayload,
    QuestionOptionEntity,
} from "../schema/QuestionOptionSchema";
import {
    QuestionOptionListResponseSchema,
    QuestionOptionCreateResponseSchema,
    QuestionOptionUpdateResponseSchema,
    QuestionOptionShowResponseSchema,
    QuestionOptionListResponse,
    QuestionOptionShowResponse,
    QuestionOptionCreateResponse,
    QuestionOptionUpdateResponse,
} from "../response/QuestionOptionResponse";

const API_VERSION = "v1";
const queryKey = "question-options";

export const useQuestionOptionIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<QuestionOptionListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: QuestionOptionListResponseSchema,
        query: { key: queryKey },
    });
};

export const useQuestionOptionShow = (id: string | number) => {
    return useBaseShow<QuestionOptionShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: QuestionOptionShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useQuestionOptionCreate = () => {
    return useBaseCreate<QuestionOptionCreatePayload, QuestionOptionCreateResponse, QuestionOptionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: QuestionOptionCreateResponseSchema,
        queryKey,
    });
};

export const useQuestionOptionUpdate = () => {
    return useBaseUpdate<QuestionOptionUpdatePayload, QuestionOptionUpdateResponse, QuestionOptionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: QuestionOptionUpdateResponseSchema,
        queryKey,
    });
};

export const useQuestionOptionDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, QuestionOptionEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
