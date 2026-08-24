import useBaseInfiniteIndex from "@/services/base/hooks/useBaseInfiniteIndex";
import { IndexContactResponseSchema } from "@/services/contacts/response/IndexContactResponse";

const API_VERSION = "v1";

interface IndexContactProps {
    params?: {
        segment_id?: string;
        search?: string;
        per_page?: number;
        [key: string]: unknown;
    };
}

const useIndexContactInfinite = (query: IndexContactProps) =>
    useBaseInfiniteIndex({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            params: query.params,
        },
        query: {
            key: "contact-list-infinite",
        },
        schema: IndexContactResponseSchema,
    });

export default useIndexContactInfinite;
