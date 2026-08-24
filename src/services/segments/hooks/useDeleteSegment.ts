import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import {
    DeleteSegmentResponse,
    DeleteSegmentResponseSchema,
} from "@/services/segments/response/DeleteSegmentResponse";
import { SingleSegmentResponse } from "@/services/segments/response/IndexSegmentResponse";

const API_VERSION = "v1";

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
