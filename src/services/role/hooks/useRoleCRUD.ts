import { Role } from "@/auth/response/loginResponseSchema";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { CreateRoleResponse, CreateRoleResponseSchema } from "@/services/role";
import { DeleteRoleResponse, DeleteRoleResponseSchema } from "@/services/role";
import { IndexRoleResponseSchema } from "@/services/role";
import { UpdateRoleResponse, UpdateRoleResponseSchema } from "@/services/role";
import { CreateRole } from "@/services/role";
import { UpdateRole } from "@/services/role";

const API_VERSION = "v1";

export default function useCreateRole() {
    return useBaseCreate<CreateRole, CreateRoleResponse, Role>({
        queryKey: 'role-list',
        endpoint: `${API_VERSION}/roles`,
        schema: CreateRoleResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error creating user:", error);
                throw error;
            },
        }
    });
}

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

