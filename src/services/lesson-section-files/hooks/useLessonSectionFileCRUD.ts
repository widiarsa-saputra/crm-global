import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexLessonSectionFileResponseSchema,
    IndexLessonSectionFileResponse,
    LessonSectionFileMutationResponseSchema,
    LessonSectionFileMutationResponse,
    ShowLessonSectionFileResponse,
    ShowLessonSectionFileResponseSchema,
} from "../response/LessonSectionFileResponse";
import { 
    LessonSectionFileCreatePayload, 
    LessonSectionFileUpdatePayload,
    LessonSectionFileEntity
} from "../schema/LessonSectionFileSchema";

const API_VERSION = "v1";
const queryKey = "lesson-section-files";

export const useLessonSectionFileIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexLessonSectionFileResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: IndexLessonSectionFileResponseSchema,
        query: { key: queryKey },
    });
};

export const useLessonSectionFileShow = (id: string | number) => {
    return useBaseShow<ShowLessonSectionFileResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, id: String(id) },
        schema: ShowLessonSectionFileResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useLessonSectionFileCreate = () => {
    return useBaseCreate<LessonSectionFileCreatePayload, LessonSectionFileMutationResponse, LessonSectionFileEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: LessonSectionFileMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useLessonSectionFileUpdate = () => {
    return useBaseUpdate<LessonSectionFileUpdatePayload, LessonSectionFileMutationResponse, LessonSectionFileEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: LessonSectionFileMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useLessonSectionFileDelete = () => {
    return useBaseDelete<{ id: string | number }, LessonSectionFileMutationResponse, LessonSectionFileEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: LessonSectionFileMutationResponseSchema,
        queryKey: queryKey,
    });
};
