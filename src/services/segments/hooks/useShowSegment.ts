import useBaseShow from "@/services/base/hooks/useBaseShow";
import { ShowSegmentResponseSchema } from "@/services/segments/response/ShowSegmentResponse";

const API_VERSION = "v1";

interface ShowSegmentProps {
    id: string;
}

const useShowSegment = ({ id }: ShowSegmentProps) =>
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

export default useShowSegment;
