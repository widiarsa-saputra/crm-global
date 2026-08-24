import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { UpdateSegment } from "@/services/segments/schema/UpdateSegmentSchema";
import {
    UpdateSegmentResponse,
    UpdateSegmentResponseSchema,
} from "@/services/segments/response/UpdateSegmentResponse";
import { SingleSegmentResponse } from "@/services/segments/response/IndexSegmentResponse";

const API_VERSION = "v1";

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
