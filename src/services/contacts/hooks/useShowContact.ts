import useBaseShow from "@/services/base/hooks/useBaseShow";
import { ShowContactResponseSchema } from "@/services/contacts/response/ShowContactResponse";

const API_VERSION = "v1";

interface ShowContactProps {
    id: string;
}

const useShowContact = ({ id }: ShowContactProps) =>
    useBaseShow({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            id,
        },
        query: {
            key: "contact-detail",
        },
        schema: ShowContactResponseSchema,
    });

export default useShowContact;
