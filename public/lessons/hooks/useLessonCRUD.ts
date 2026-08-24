import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    LessonCreatePayload,
    LessonEntity,
    LessonUpdatePayload
} from "../schema/LessonSchema";
import {
    LessonListResponseSchema,
    LessonCreateResponseSchema,
    LessonUpdateResponseSchema,
    LessonShowResponseSchema,
    LessonListResponse,
    LessonShowResponse,
    LessonCreateResponse,
    LessonUpdateResponse
} from "../response/LessonResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "lessons";
const API_VERSION = "v1";

export const useLessonIndex = (params?: object) => {
    return useBaseIndex<LessonListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: LessonListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useLessonShow = (id: string | number, params?: object) => {
    return useBaseShow<LessonShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: LessonShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useLessonCreate = () => {
    return useBaseCreate<LessonCreatePayload, LessonCreateResponse, LessonEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: LessonCreateResponseSchema,
        queryKey,
    });
};

export const useLessonUpdate = () => {
    return useBaseUpdate<LessonUpdatePayload, LessonUpdateResponse, LessonEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: LessonUpdateResponseSchema,
        queryKey,
    });
};

export const useLessonDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, LessonEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
