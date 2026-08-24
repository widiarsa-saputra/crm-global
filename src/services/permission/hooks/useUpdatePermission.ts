import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { UpdatePermission } from "@/services/permission/schema/UpdatePermissionSchema";
import { UpdatePermissionResponse, UpdatePermissionResponseSchema } from "@/services/permission/response/UpdatePermissionResponse";
import { SinglePermissionResponse } from "../response/IndexPermissionResponse";

const API_VERSION = "v1";

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
