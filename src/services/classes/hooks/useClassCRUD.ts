import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    ClassCreatePayload,
    ClassEntity,
    ClassUpdatePayload
} from "../schema/ClassSchema";
import {
    ClassListResponseSchema,
    ClassCreateResponseSchema,
    ClassUpdateResponseSchema,
    ClassShowResponseSchema,
    ClassListResponse,
    ClassShowResponse,
    ClassCreateResponse,
    ClassUpdateResponse
} from "../response/ClassResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "classes";
const API_VERSION = "v1";

export const useClassIndex = (params?: object) => {
    return useBaseIndex<ClassListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: ClassListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useClassShow = (id: string | number, params?: object) => {
    return useBaseShow<ClassShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: ClassShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useClassCreate = () => {
    return useBaseCreate<ClassCreatePayload, ClassCreateResponse, ClassEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: ClassCreateResponseSchema,
        queryKey,
    });
};

export const useClassUpdate = () => {
    return useBaseUpdate<ClassUpdatePayload, ClassUpdateResponse, ClassEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: ClassUpdateResponseSchema,
        queryKey,
    });
};

export const useClassDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, ClassEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
