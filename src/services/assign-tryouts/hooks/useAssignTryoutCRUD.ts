import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexAssignTryoutResponseSchema,
    IndexAssignTryoutResponse,
    AssignTryoutMutationResponseSchema,
    AssignTryoutMutationResponse,
    ShowAssignTryoutResponse,
    ShowAssignTryoutResponseSchema,
} from "../response/AssignTryoutResponse";
import { 
    AssignTryoutCreatePayload, 
    AssignTryoutUpdatePayload,
    AssignTryoutEntity
} from "../schema/AssignTryoutSchema";

const API_VERSION = "v1";
const queryKey = "assign-tryouts";

export const useAssignTryoutIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexAssignTryoutResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexAssignTryoutResponseSchema,
        query: { key: queryKey },
    });
};

export const useAssignTryoutShow = (id: string | number) => {
    return useBaseShow<ShowAssignTryoutResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowAssignTryoutResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useAssignTryoutCreate = () => {
    return useBaseCreate<AssignTryoutCreatePayload, AssignTryoutMutationResponse, AssignTryoutEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: AssignTryoutMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useAssignTryoutUpdate = () => {
    return useBaseUpdate<AssignTryoutUpdatePayload, AssignTryoutMutationResponse, AssignTryoutEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: AssignTryoutMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useAssignTryoutDelete = () => {
    return useBaseDelete<{ id: string | number }, AssignTryoutMutationResponse, AssignTryoutEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: AssignTryoutMutationResponseSchema,
        queryKey: queryKey,
    });
};
