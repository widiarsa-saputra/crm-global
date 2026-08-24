import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { IndexRoleResponseSchema } from "@/services/role/response/IndexRoleResponse";

const API_VERSION = "v1";

interface IndexRoleProps {
    params?: { [key: string]: any };
}

const useIndexRole = (query: IndexRoleProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/roles`,
            params: query.params,
        },
        query: {
            key: "role-list",
        },
        schema: IndexRoleResponseSchema,
    });

export default useIndexRole;