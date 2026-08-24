import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { DeletePermissionResponse, DeletePermissionResponseSchema } from "@/services/permission/response/DeletePermissionResponse";
import { SinglePermissionResponse } from "../response/IndexPermissionResponse";

const API_VERSION = "v1";

export const useDeletePermission = () => {
    return useBaseDelete<{ id: number }, DeletePermissionResponse, SinglePermissionResponse>({
        queryKey: 'permision-list',
        endpoint: ({ id }) => `${API_VERSION}/permissions/${id}`,
        schema: DeletePermissionResponseSchema,
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                throw error;
            },
        }
    });
};