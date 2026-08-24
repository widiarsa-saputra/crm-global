import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    CourseCreatePayload,
    CourseEntity,
    CourseUpdatePayload
} from "../schema/CourseSchema";
import {
    CourseListResponseSchema,
    CourseCreateResponseSchema,
    CourseUpdateResponseSchema,
    CourseShowResponseSchema,
    CourseListResponse,
    CourseShowResponse,
    CourseCreateResponse,
    CourseUpdateResponse
} from "../response/CourseResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "courses";
const API_VERSION = "v1";

export const useCourseIndex = (params?: object) => {
    return useBaseIndex<CourseListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: CourseListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useCourseShow = (id: string | number, params?: object) => {
    return useBaseShow<CourseShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: CourseShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useCourseCreate = () => {
    return useBaseCreate<CourseCreatePayload, CourseCreateResponse, CourseEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CourseCreateResponseSchema,
        queryKey,
    });
};

export const useCourseUpdate = () => {
    return useBaseUpdate<CourseUpdatePayload, CourseUpdateResponse, CourseEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CourseUpdateResponseSchema,
        queryKey,
    });
};

export const useCourseDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, CourseEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
