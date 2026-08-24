import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { UpdateRole } from "@/services/role/schema/UpdateRoleSchema";
import { UpdateRoleResponse, UpdateRoleResponseSchema } from "@/services/role/response/UpdateRoleResponse";
import { Role } from "@/auth/response/loginResponseSchema";

const API_VERSION = "v1";

export const useUpdateRole = () => {
    return useBaseUpdate<UpdateRole, UpdateRoleResponse, Role>({
        queryKey: 'role-list',
        endpoint: ({ id }) => `${API_VERSION}/roles/${id}`,
        schema: UpdateRoleResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: UpdateRoleResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        }
    });
};
