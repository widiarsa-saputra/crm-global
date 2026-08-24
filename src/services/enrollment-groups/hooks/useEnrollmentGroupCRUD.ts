import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexEnrollmentGroupResponseSchema,
    IndexEnrollmentGroupResponse,
    EnrollmentGroupMutationResponseSchema,
    EnrollmentGroupMutationResponse,
    ShowEnrollmentGroupResponse,
    ShowEnrollmentGroupResponseSchema,
} from "../response/EnrollmentGroupResponse";
import { 
    EnrollmentGroupCreatePayload, 
    EnrollmentGroupUpdatePayload,
    EnrollmentGroupEntity
} from "../schema/EnrollmentGroupSchema";

const API_VERSION = "v1";
const queryKey = "enrollment-groups";

export const useEnrollmentGroupIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexEnrollmentGroupResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexEnrollmentGroupResponseSchema,
        query: { key: queryKey },
    });
};

export const useEnrollmentGroupShow = (id: string | number) => {
    return useBaseShow<ShowEnrollmentGroupResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowEnrollmentGroupResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useEnrollmentGroupCreate = () => {
    return useBaseCreate<EnrollmentGroupCreatePayload, EnrollmentGroupMutationResponse, EnrollmentGroupEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: EnrollmentGroupMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useEnrollmentGroupUpdate = () => {
    return useBaseUpdate<EnrollmentGroupUpdatePayload, EnrollmentGroupMutationResponse, EnrollmentGroupEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: EnrollmentGroupMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useEnrollmentGroupDelete = () => {
    return useBaseDelete<{ id: string | number }, EnrollmentGroupMutationResponse, EnrollmentGroupEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: EnrollmentGroupMutationResponseSchema,
        queryKey: queryKey,
    });
};
