import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/api/api";
import { DeleteFileResponse, DeleteFileResponseSchema } from "@/services/file/response/DeleteFileResponse";

const API_VERSION = "v1";

interface ForceDeleteFileParams {
    ids: string[];
}

export const useForceDeleteFile = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteFileResponse, Error, ForceDeleteFileParams>({
        mutationFn: async (params: ForceDeleteFileParams): Promise<DeleteFileResponse> => {
            const response = await privateApi.post(`/${API_VERSION}/files/force-delete`, {
                ids: params.ids.join(', '),
                _method: 'DELETE'
            });

            return DeleteFileResponseSchema.parse(response.data);
        },
        onSuccess: () => {
            // Invalidate file list to refetch
            queryClient.invalidateQueries({ queryKey: ['file-list'] });
        },
    });
};

export default useForceDeleteFile;
