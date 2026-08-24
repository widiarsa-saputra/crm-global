import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseShow from "@/services/base/hooks/useBaseShow";

import {
    IndexPaymentResponseSchema,
    IndexPaymentResponse,
    PaymentMutationResponseSchema,
    PaymentMutationResponse,
    ShowPaymentResponse,
    ShowPaymentResponseSchema,
} from "../response/PaymentResponse";
import { 
    PaymentCreatePayload, 
    PaymentUpdatePayload,
    PaymentEntity
} from "../schema/PaymentSchema";

const API_VERSION = "v1";
const queryKey = "payments";

export const usePaymentIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<IndexPaymentResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: IndexPaymentResponseSchema,
        query: { key: queryKey },
    });
};

export const usePaymentShow = (id: string | number) => {
    return useBaseShow<ShowPaymentResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: ShowPaymentResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const usePaymentCreate = () => {
    return useBaseCreate<PaymentCreatePayload, PaymentMutationResponse, PaymentEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: PaymentMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const usePaymentUpdate = () => {
    return useBaseUpdate<PaymentUpdatePayload, PaymentMutationResponse, PaymentEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: PaymentMutationResponseSchema,
        queryKey: queryKey,
    });
};

export const usePaymentDelete = () => {
    return useBaseDelete<{ id: string | number }, PaymentMutationResponse, PaymentEntity>({
        endpoint: (params: { id: string | number }) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: PaymentMutationResponseSchema,
        queryKey: queryKey,
    });
};
