import { Role } from "@/auth/response/loginResponseSchema";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { DeleteRoleResponse, DeleteRoleResponseSchema } from "@/services/role/response/DeleteRoleResponse";

const API_VERSION = "v1";

export const useDeleteRole = () => {
    return useBaseDelete<{ id: number }, DeleteRoleResponse, Role>({
        queryKey: 'role-list',
        endpoint: ({ id }) => `${API_VERSION}/roles/${id}`,
        schema: DeleteRoleResponseSchema,
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                throw error;
            },
        }
    });
};