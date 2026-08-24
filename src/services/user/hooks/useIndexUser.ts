import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { IndexUserResponseSchema } from "@/services/user/response/IndexUserResponse";

const API_VERSION = "v1";

interface IndexUserProps {
    params?: { [key: string]: any };
}

const useIndexUser = (query: IndexUserProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/users`,
            params: query.params,
        },
        query: {
            key: "user-list"
        },
        schema: IndexUserResponseSchema,
    });

export default useIndexUser;
