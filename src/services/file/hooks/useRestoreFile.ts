import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/api/api";
import { DeleteFileResponse, DeleteFileResponseSchema } from "@/services/file/response/DeleteFileResponse";

const API_VERSION = "v1";

interface RestoreFileParams {
    ids: string[];
}

export const useRestoreFile = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteFileResponse, Error, RestoreFileParams>({
        mutationFn: async (params: RestoreFileParams): Promise<DeleteFileResponse> => {
            const response = await privateApi.post(`/${API_VERSION}/files/restore`, {
                ids: params.ids.join(', '),
                _method: 'PATCH'
            });

            return DeleteFileResponseSchema.parse(response.data);
        },
        onSuccess: () => {
            // Invalidate file list to refetch
            queryClient.invalidateQueries({ queryKey: ['file-list'] });
        },
    });
};

export default useRestoreFile;
