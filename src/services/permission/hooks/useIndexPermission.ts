import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { IndexPermissionResponseSchema } from "@/services/permission/response/IndexPermissionResponse";

const API_VERSION = "v1";

interface IndexPermissionProps {
    params?: { [key: string]: any };
}

const useIndexPermission = (query: IndexPermissionProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/permissions`,
            params: query.params,
        },
        query: {
            key: "permission-list",
        },
        schema: IndexPermissionResponseSchema,
    });

export default useIndexPermission;