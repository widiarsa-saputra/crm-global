import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { DeleteFileResponse, DeleteFileResponseSchema } from "@/services/file/response/DeleteFileResponse";
import { useQueryClient } from "@tanstack/react-query";
import { SingleFileResponse } from "../response/IndexFileResponse";

const API_VERSION = "v1";

export const useDeleteFile = () => {
    const queryClient = useQueryClient();

    return useBaseDelete<{ id: string }, DeleteFileResponse, SingleFileResponse>({
        queryKey: 'file-list',
        endpoint: ({ id }) => `${API_VERSION}/files/${id}`,
        schema: DeleteFileResponseSchema,
        query: {
            onSuccess: (data) => {
                // Invalidate queries to refetch file list
                queryClient.invalidateQueries({ queryKey: ['file-list'] });
                return data;
            },
            onError: (error) => {
                throw error;
            },
        }
    });
};

export default useDeleteFile;
