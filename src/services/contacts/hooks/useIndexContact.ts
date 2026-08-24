import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { IndexContactResponseSchema } from "@/services/contacts/response/IndexContactResponse";

const API_VERSION = "v1";

interface IndexContactProps {
    params?: {
        segment_id?: string;
        search?: string;
        page?: number;
        [key: string]: unknown;
    };
}

const useIndexContact = (query: IndexContactProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            params: query.params,
        },
        query: {
            key: "contact-list",
        },
        schema: IndexContactResponseSchema,
    });

export default useIndexContact;
