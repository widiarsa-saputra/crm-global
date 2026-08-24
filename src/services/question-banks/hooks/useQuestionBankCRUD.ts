import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    QuestionBankCreatePayload,
    QuestionBankEntity,
    QuestionBankUpdatePayload,
} from "../schema/QuestionBankSchema";
import {
    QuestionBankListResponseSchema,
    QuestionBankCreateResponseSchema,
    QuestionBankUpdateResponseSchema,
    QuestionBankShowResponseSchema,
    QuestionBankListResponse,
    QuestionBankShowResponse,
    QuestionBankCreateResponse,
    QuestionBankUpdateResponse,
} from "../response/QuestionBankResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "question-banks";
const API_VERSION = "v1";

export const useQuestionBankIndex = (params?: object) => {
    return useBaseIndex<QuestionBankListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: QuestionBankListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useQuestionBankShow = (id: string | number, params?: object) => {
    return useBaseShow<QuestionBankShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params,
        },
        schema: QuestionBankShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useQuestionBankCreate = () => {
    return useBaseCreate<QuestionBankCreatePayload, QuestionBankCreateResponse, QuestionBankEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: QuestionBankCreateResponseSchema,
        queryKey,
    });
};

export const useQuestionBankUpdate = () => {
    return useBaseUpdate<QuestionBankUpdatePayload, QuestionBankUpdateResponse, QuestionBankEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: QuestionBankUpdateResponseSchema,
        queryKey,
    });
};

export const useQuestionBankDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, QuestionBankEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
