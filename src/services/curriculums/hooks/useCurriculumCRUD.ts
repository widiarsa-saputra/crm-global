import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexCurriculumResponseSchema,
    IndexCurriculumResponse,
    CurriculumMutationResponseSchema,
    CurriculumMutationResponse,
    ShowCurriculumResponse,
    ShowCurriculumResponseSchema,
} from "../response/CurriculumResponse";
import { 
    CurriculumCreatePayload, 
    CurriculumUpdatePayload,
    CurriculumEntity
} from "../schema/CurriculumSchema";

const API_VERSION = "v1";
const queryKey = "curriculums";

export const useCurriculumIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexCurriculumResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexCurriculumResponseSchema,
        query: { key: queryKey },
    });
};

export const useCurriculumShow = (id: string | number) => {
    return useBaseShow<ShowCurriculumResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowCurriculumResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useCurriculumCreate = () => {
    return useBaseCreate<CurriculumCreatePayload, CurriculumMutationResponse, CurriculumEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CurriculumMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useCurriculumUpdate = () => {
    return useBaseUpdate<CurriculumUpdatePayload, CurriculumMutationResponse, CurriculumEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: CurriculumMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useCurriculumDelete = () => {
    return useBaseDelete<{ id: string | number }, CurriculumMutationResponse, CurriculumEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: CurriculumMutationResponseSchema,
        queryKey: queryKey,
    });
};
