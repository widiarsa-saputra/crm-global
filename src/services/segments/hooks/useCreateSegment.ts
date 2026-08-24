import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { CreateSegment } from "@/services/segments/schema/CreateSegmentSchema";
import {
    CreateSegmentResponse,
    CreateSegmentResponseSchema,
} from "@/services/segments/response/CreateSegmentResponse";
import { SingleSegmentResponse } from "@/services/segments/response/IndexSegmentResponse";

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
