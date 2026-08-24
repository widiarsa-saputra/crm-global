import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexPeriodResponseSchema,
    IndexPeriodResponse,
    PeriodMutationResponseSchema,
    PeriodMutationResponse,
    ShowPeriodResponse,
    ShowPeriodResponseSchema,
} from "../response/PeriodResponse";
import { 
    PeriodCreatePayload, 
    PeriodUpdatePayload,
    PeriodEntity
} from "../schema/PeriodSchema";

const API_VERSION = "v1";
const queryKey = "periods";

export const usePeriodIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexPeriodResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexPeriodResponseSchema,
        query: { key: queryKey },
    });
};

export const usePeriodShow = (id: string | number) => {
    return useBaseShow<ShowPeriodResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowPeriodResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const usePeriodCreate = () => {
    return useBaseCreate<PeriodCreatePayload, PeriodMutationResponse, PeriodEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: PeriodMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const usePeriodUpdate = () => {
    return useBaseUpdate<PeriodUpdatePayload, PeriodMutationResponse, PeriodEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: PeriodMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const usePeriodDelete = () => {
    return useBaseDelete<{ id: string | number }, PeriodMutationResponse, PeriodEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: PeriodMutationResponseSchema,
        queryKey: queryKey,
    });
};
