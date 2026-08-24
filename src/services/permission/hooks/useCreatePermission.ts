import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { CreatePermission } from "@/services/permission/schema/CreatePermissionSchema";
import { CreatePermissionResponse, CreatePermissionResponseSchema } from "@/services/permission/response/CreatePermissionResponse";
import { SinglePermissionResponse } from "../response/IndexPermissionResponse";

const API_VERSION = "v1";

export default function useCreatePermission() {
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