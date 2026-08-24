import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    CourseCategoryCreatePayload,
    CourseCategoryEntity,
    CourseCategoryUpdatePayload
} from "../schema/CourseCategorySchema";
import {
    CourseCategoryListResponseSchema,
    CourseCategoryCreateResponseSchema,
    CourseCategoryUpdateResponseSchema,
    CourseCategoryShowResponseSchema,
    CourseCategoryListResponse,
    CourseCategoryShowResponse,
    CourseCategoryCreateResponse,
    CourseCategoryUpdateResponse
} from "../response/CourseCategoryResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "course-categories";
const API_VERSION = "v1";

export const useCourseCategoryIndex = (params?: object) => {
    return useBaseIndex<CourseCategoryListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: CourseCategoryListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useCourseCategoryShow = (id: string | number, params?: object) => {
    return useBaseShow<CourseCategoryShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: CourseCategoryShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useCourseCategoryCreate = () => {
    return useBaseCreate<CourseCategoryCreatePayload, CourseCategoryCreateResponse, CourseCategoryEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CourseCategoryCreateResponseSchema,
        queryKey,
    });
};

export const useCourseCategoryUpdate = () => {
    return useBaseUpdate<CourseCategoryUpdatePayload, CourseCategoryUpdateResponse, CourseCategoryEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CourseCategoryUpdateResponseSchema,
        queryKey,
    });
};

export const useCourseCategoryDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, CourseCategoryEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
