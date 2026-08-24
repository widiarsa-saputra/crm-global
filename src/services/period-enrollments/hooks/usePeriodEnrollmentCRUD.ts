import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexPeriodEnrollmentResponseSchema,
    IndexPeriodEnrollmentResponse,
    PeriodEnrollmentMutationResponseSchema,
    PeriodEnrollmentMutationResponse,
    ShowPeriodEnrollmentResponse,
    ShowPeriodEnrollmentResponseSchema,
} from "../response/PeriodEnrollmentResponse";
import { 
    PeriodEnrollmentCreatePayload, 
    PeriodEnrollmentUpdatePayload,
    PeriodEnrollmentEntity
} from "../schema/PeriodEnrollmentSchema";

const API_VERSION = "v1";
const queryKey = "period-enrollments";

export const usePeriodEnrollmentIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexPeriodEnrollmentResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexPeriodEnrollmentResponseSchema,
        query: { key: queryKey },
    });
};

export const usePeriodEnrollmentShow = (id: string | number) => {
    return useBaseShow<ShowPeriodEnrollmentResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowPeriodEnrollmentResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const usePeriodEnrollmentCreate = () => {
    return useBaseCreate<PeriodEnrollmentCreatePayload, PeriodEnrollmentMutationResponse, PeriodEnrollmentEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: PeriodEnrollmentMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const usePeriodEnrollmentUpdate = () => {
    return useBaseUpdate<PeriodEnrollmentUpdatePayload, PeriodEnrollmentMutationResponse, PeriodEnrollmentEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: PeriodEnrollmentMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const usePeriodEnrollmentDelete = () => {
    return useBaseDelete<{ id: string | number }, PeriodEnrollmentMutationResponse, PeriodEnrollmentEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: PeriodEnrollmentMutationResponseSchema,
        queryKey: queryKey,
    });
};
