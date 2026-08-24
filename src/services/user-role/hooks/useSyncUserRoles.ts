import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { SyncUserRoles } from "@/services/user-role/schema/SyncUserRolesSchema";
// Import skema dan tipe data respons yang baru
import { SyncUserRolesResponse, SyncUserRolesResponseSchema } from "@/services/user-role/response/SyncUserRolesResponse";

const API_VERSION = "v1";

export default function useSyncUserRoles() {
    // Ganti tipe data respons yang diharapkan dan skema validasinya
    return useBaseCreate<SyncUserRoles, SyncUserRolesResponse, { id: string }>({
        endpoint: `${API_VERSION}/user-roles/sync-roles`,
        queryKey: 'user-list',
        schema: SyncUserRolesResponseSchema, // Gunakan skema yang baru
        contentType: "application/json",
    });
}