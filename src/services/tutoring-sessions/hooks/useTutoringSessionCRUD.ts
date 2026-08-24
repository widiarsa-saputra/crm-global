import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexTutoringSessionResponseSchema,
    IndexTutoringSessionResponse,
    TutoringSessionMutationResponseSchema,
    TutoringSessionMutationResponse,
    ShowTutoringSessionResponse,
    ShowTutoringSessionResponseSchema,
} from "../response/TutoringSessionResponse";
import { 
    TutoringSessionCreatePayload, 
    TutoringSessionUpdatePayload,
    TutoringSessionEntity
} from "../schema/TutoringSessionSchema";

const API_VERSION = "v1";
const queryKey = "tutoring-sessions";

export const useTutoringSessionIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexTutoringSessionResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexTutoringSessionResponseSchema,
        query: { key: queryKey },
    });
};

export const useTutoringSessionShow = (id: string | number) => {
    return useBaseShow<ShowTutoringSessionResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowTutoringSessionResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useTutoringSessionCreate = () => {
    return useBaseCreate<TutoringSessionCreatePayload, TutoringSessionMutationResponse, TutoringSessionEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TutoringSessionMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useTutoringSessionUpdate = () => {
    return useBaseUpdate<TutoringSessionUpdatePayload, TutoringSessionMutationResponse, TutoringSessionEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: TutoringSessionMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const useTutoringSessionDelete = () => {
    return useBaseDelete<{ id: string | number }, TutoringSessionMutationResponse, TutoringSessionEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: TutoringSessionMutationResponseSchema,
        queryKey: queryKey,
    });
};
