import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/api/api";
import { UploadFileResponse, UploadFileResponseSchema } from "@/services/file/response/UploadFileResponse";

const API_VERSION = "v1";

interface UploadFileParams {
    file: File;
    folder_id?: number;
    user_id?: number;
    is_compressed?: boolean | null;
    title?: string;
    description?: string | null;
}

export const useUploadFile = () => {
    const queryClient = useQueryClient();

    return useMutation<UploadFileResponse, Error, UploadFileParams>({
        mutationFn: async (params: UploadFileParams): Promise<UploadFileResponse> => {
            const formData = new FormData();
            formData.append('file', params.file);
            
            if (params.folder_id !== undefined) {
                formData.append('folder_id', params.folder_id.toString());
            }
            if (params.user_id !== undefined) {
                formData.append('user_id', params.user_id.toString());
            }
            if (params.is_compressed !== undefined && params.is_compressed !== null) {
                formData.append('is_compressed', params.is_compressed.toString());
            }
            if (params.title) {
                formData.append('title', params.title);
            }
            if (params.description) {
                formData.append('description', params.description);
            }

            const response = await privateApi.post(`/${API_VERSION}/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return UploadFileResponseSchema.parse(response.data);
        },
        onSuccess: () => {
            // Invalidate file list to refetch
            queryClient.invalidateQueries({ queryKey: ['file-list'] });
        },
    });
};

export default useUploadFile;
