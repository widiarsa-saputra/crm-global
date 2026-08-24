import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { CreateSegmentResponse, CreateSegmentResponseSchema } from "@/services/segments";
import { DeleteSegmentResponse, DeleteSegmentResponseSchema } from "@/services/segments";
import { IndexSegmentResponseSchema, SingleSegmentResponse } from "@/services/segments";
import { ShowSegmentResponseSchema } from "@/services/segments";
import { UpdateSegmentResponse, UpdateSegmentResponseSchema } from "@/services/segments";
import { CreateSegment } from "@/services/segments";
import { UpdateSegment } from "@/services/segments";

const API_VERSION = "v1";

export const useCreateSegment = () =>
    useBaseCreate<CreateSegment, CreateSegmentResponse, SingleSegmentResponse>({
        endpoint: `${API_VERSION}/segments`,
        schema: CreateSegmentResponseSchema,
        contentType: "application/json",
        queryKey: "segment-list",
        query: {
            onSuccess: (data: CreateSegmentResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });



interface DeleteSegmentParams {
    id: string;
}

export const useDeleteSegment = () =>
    useBaseDelete<DeleteSegmentParams, DeleteSegmentResponse, SingleSegmentResponse>({
        endpoint: ({ id }) => `/${API_VERSION}/segments/${id}`,
        schema: DeleteSegmentResponseSchema,
        queryKey: "segment-list",
        query: {
            onSuccess: (data: DeleteSegmentResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });



interface IndexSegmentProps {
    params?: { [key: string]: unknown };
}

export const useIndexSegment = (query: IndexSegmentProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/segments`,
            params: query.params,
        },
        query: {
            key: "segment-list",
        },
        schema: IndexSegmentResponseSchema,
    });





interface ShowSegmentProps {
    id: string;
}

export const useShowSegment = ({ id }: ShowSegmentProps) =>
    useBaseShow({
        request: {
            endpoint: `${API_VERSION}/segments`,
            id,
        },
        query: {
            key: "segment-detail",
        },
        schema: ShowSegmentResponseSchema,
    });





export const useUpdateSegment = () =>
    useBaseUpdate<UpdateSegment, UpdateSegmentResponse, SingleSegmentResponse>({
        endpoint: ({ id }) => `${API_VERSION}/segments/${id}`,
        schema: UpdateSegmentResponseSchema,
        contentType: "application/json",
        queryKey: "segment-list",
        query: {
            onSuccess: (data: UpdateSegmentResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });

