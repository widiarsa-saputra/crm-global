import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    CourseSectionCreatePayload,
    CourseSectionEntity,
    CourseSectionUpdatePayload
} from "../schema/CourseSectionSchema";
import {
    CourseSectionListResponseSchema,
    CourseSectionCreateResponseSchema,
    CourseSectionUpdateResponseSchema,
    CourseSectionShowResponseSchema,
    CourseSectionListResponse,
    CourseSectionShowResponse,
    CourseSectionCreateResponse,
    CourseSectionUpdateResponse
} from "../response/CourseSectionResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "course-sections";
const API_VERSION = "v1";

export const useCourseSectionIndex = (params?: object) => {
    return useBaseIndex<CourseSectionListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: CourseSectionListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useCourseSectionShow = (id: string | number, params?: object) => {
    return useBaseShow<CourseSectionShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: CourseSectionShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useCourseSectionCreate = () => {
    return useBaseCreate<CourseSectionCreatePayload, CourseSectionCreateResponse, CourseSectionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CourseSectionCreateResponseSchema,
        queryKey,
    });
};

export const useCourseSectionUpdate = () => {
    return useBaseUpdate<CourseSectionUpdatePayload, CourseSectionUpdateResponse, CourseSectionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: CourseSectionUpdateResponseSchema,
        queryKey,
    });
};

export const useCourseSectionDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, CourseSectionEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
