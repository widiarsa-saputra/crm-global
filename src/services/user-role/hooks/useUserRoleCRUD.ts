import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { CreateUserRoleResponse, CreateUserRoleResponseSchema } from "@/services/user-role";
import { SyncUserRolesResponse, SyncUserRolesResponseSchema } from "@/services/user-role";
import { CreateUserRole } from "@/services/user-role";
import { SyncUserRoles } from "@/services/user-role";
import { User } from "@/shared/components/facebook-style-chat/types";

const API_VERSION = "v1";

export function useCreateUserRole() {
    return useBaseCreate<CreateUserRole, CreateUserRoleResponse, User>({
        queryKey: "user-list",
        endpoint: `${API_VERSION}/user-roles/sync-users`,
        schema: CreateUserRoleResponseSchema,
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



export function useSyncUserRoles() {
    // Ganti tipe data respons yang diharapkan dan skema validasinya
    return useBaseCreate<SyncUserRoles, SyncUserRolesResponse, { id: string }>({
        endpoint: `${API_VERSION}/user-roles/sync-roles`,
        queryKey: 'user-list',
        schema: SyncUserRolesResponseSchema, // Gunakan skema yang baru
        contentType: "application/json",
    });
}

