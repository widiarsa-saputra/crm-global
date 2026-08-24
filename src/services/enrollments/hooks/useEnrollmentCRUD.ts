import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexEnrollmentResponseSchema,
    IndexEnrollmentResponse,
    EnrollmentMutationResponseSchema,
    EnrollmentMutationResponse,
    ShowEnrollmentResponse,
    ShowEnrollmentResponseSchema,
} from "../response/EnrollmentResponse";
import { 
    EnrollmentCreatePayload, 
    EnrollmentUpdatePayload,
    EnrollmentEntity
} from "../schema/EnrollmentSchema";

const API_VERSION = "v1";
const queryKey = "enrollments";

export const useEnrollmentIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexEnrollmentResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexEnrollmentResponseSchema,
        query: { key: queryKey },
    });
};

export const useEnrollmentShow = (id: string | number) => {
    return useBaseShow<ShowEnrollmentResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowEnrollmentResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useEnrollmentCreate = () => {
    return useBaseCreate<EnrollmentCreatePayload, EnrollmentMutationResponse, EnrollmentEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: EnrollmentMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useEnrollmentUpdate = () => {
    return useBaseUpdate<EnrollmentUpdatePayload, EnrollmentMutationResponse, EnrollmentEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: EnrollmentMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useEnrollmentDelete = () => {
    return useBaseDelete<{ id: string | number }, EnrollmentMutationResponse, EnrollmentEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: EnrollmentMutationResponseSchema,
        queryKey: queryKey,
    });
};
