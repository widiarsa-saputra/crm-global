import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexLessonSectionResponseSchema,
    IndexLessonSectionResponse,
    LessonSectionMutationResponseSchema,
    LessonSectionMutationResponse,
    ShowLessonSectionResponse,
    ShowLessonSectionResponseSchema,
} from "../response/LessonSectionResponse";
import { 
    LessonSectionCreatePayload, 
    LessonSectionUpdatePayload,
    LessonSectionEntity
} from "../schema/LessonSectionSchema";

const API_VERSION = "v1";
const queryKey = "lesson-sections";

export const useLessonSectionIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexLessonSectionResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: IndexLessonSectionResponseSchema,
        query: { key: queryKey },
    });
};

export const useLessonSectionShow = (id: string | number) => {
    return useBaseShow<ShowLessonSectionResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, id: String(id) },
        schema: ShowLessonSectionResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useLessonSectionCreate = () => {
    return useBaseCreate<LessonSectionCreatePayload, LessonSectionMutationResponse, LessonSectionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: LessonSectionMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useLessonSectionUpdate = () => {
    return useBaseUpdate<LessonSectionUpdatePayload, LessonSectionMutationResponse, LessonSectionEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: LessonSectionMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useLessonSectionDelete = () => {
    return useBaseDelete<{ id: string | number }, LessonSectionMutationResponse, LessonSectionEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: LessonSectionMutationResponseSchema,
        queryKey: queryKey,
    });
};
