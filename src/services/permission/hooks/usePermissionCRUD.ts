import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { CreatePermissionResponse, CreatePermissionResponseSchema } from "@/services/permission";
import { DeletePermissionResponse, DeletePermissionResponseSchema } from "@/services/permission";
import { IndexPermissionResponseSchema } from "@/services/permission";
import { UpdatePermissionResponse, UpdatePermissionResponseSchema } from "@/services/permission";
import { CreatePermission } from "@/services/permission";
import { UpdatePermission } from "@/services/permission";
import { SinglePermissionResponse } from "../response/PermissionResponse";

const API_VERSION = "v1";

export function useCreatePermission() {
    return useBaseCreate<CreatePermission, CreatePermissionResponse, SinglePermissionResponse>({
        queryKey: 'permision-list',
        endpoint: `${API_VERSION}/permissions`,
        schema: CreatePermissionResponseSchema,
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



interface IndexPermissionProps {
    params?: { [key: string]: any };
}

export const useIndexPermission = (query: IndexPermissionProps) =>
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





export const useUpdatePermission = () => {
    return useBaseUpdate<UpdatePermission, UpdatePermissionResponse, SinglePermissionResponse>({
        queryKey: 'permision-list',
        endpoint: ({ id }) => `${API_VERSION}/permissions/${id}`,
        schema: UpdatePermissionResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: UpdatePermissionResponse) => data,
            onError: (error: Error) => {
                throw error;
            },
        }
    });
};

