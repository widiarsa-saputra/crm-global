import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { IndexSegmentResponseSchema } from "@/services/segments/response/IndexSegmentResponse";

const API_VERSION = "v1";

interface IndexSegmentProps {
    params?: { [key: string]: unknown };
}

const useIndexSegment = (query: IndexSegmentProps) =>
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

export default useIndexSegment;
