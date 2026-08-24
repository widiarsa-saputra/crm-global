import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    StudentCreatePayload,
    StudentEntity,
    StudentUpdatePayload
} from "../schema/StudentSchema";
import {
    StudentListResponseSchema,
    StudentCreateResponseSchema,
    StudentUpdateResponseSchema,
    StudentShowResponseSchema,
    StudentListResponse,
    StudentShowResponse,
    StudentCreateResponse,
    StudentUpdateResponse
} from "../response/StudentResponse";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "students";
const API_VERSION = "v1";

export const useStudentIndex = (params?: object) => {
    return useBaseIndex<StudentListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: StudentListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useStudentShow = (id: string | number, params?: object) => {
    return useBaseShow<StudentShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: StudentShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useStudentCreate = () => {
    return useBaseCreate<StudentCreatePayload, StudentCreateResponse, StudentEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: StudentCreateResponseSchema,
        queryKey,
    });
};

export const useStudentUpdate = () => {
    return useBaseUpdate<StudentUpdatePayload, StudentUpdateResponse, StudentEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: StudentUpdateResponseSchema,
        queryKey,
    });
};

export const useStudentDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, StudentEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
