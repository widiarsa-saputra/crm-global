import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexCurriculumCourseResponseSchema,
    IndexCurriculumCourseResponse,
    CurriculumCourseMutationResponseSchema,
    CurriculumCourseMutationResponse,
    ShowCurriculumCourseResponse,
    ShowCurriculumCourseResponseSchema,
} from "../response/CurriculumCourseResponse";
import { 
    CurriculumCourseCreatePayload, 
    CurriculumCourseUpdatePayload,
    CurriculumCourseEntity
} from "../schema/CurriculumCourseSchema";

const API_VERSION = "v1";
const queryKey = "curriculum-courses";

export const useCurriculumCourseIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexCurriculumCourseResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexCurriculumCourseResponseSchema,
        query: { key: queryKey },
    });
};

export const useCurriculumCourseShow = (id: string | number) => {
    return useBaseShow<ShowCurriculumCourseResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowCurriculumCourseResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useCurriculumCourseCreate = () => {
    return useBaseCreate<CurriculumCourseCreatePayload, CurriculumCourseMutationResponse, CurriculumCourseEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CurriculumCourseMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useCurriculumCourseUpdate = () => {
    return useBaseUpdate<CurriculumCourseUpdatePayload, CurriculumCourseMutationResponse, CurriculumCourseEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: CurriculumCourseMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useCurriculumCourseDelete = () => {
    return useBaseDelete<{ id: string | number }, CurriculumCourseMutationResponse, CurriculumCourseEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: CurriculumCourseMutationResponseSchema,
        queryKey: queryKey,
    });
};
