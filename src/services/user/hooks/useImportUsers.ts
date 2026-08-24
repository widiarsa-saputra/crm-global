import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";

const API_VERSION = "v1";

interface ImportUsersPayload {
    file?: File;
    preview_token?: string;
}

const useImportUsers = () => {
    return useBaseCreate<ImportUsersPayload, any, any>({
        queryKey: 'import-user',
        endpoint: `${API_VERSION}/users/import`,
        contentType: "multipart/form-data",
        schema: z.any(),
    });
};

export default useImportUsers;
