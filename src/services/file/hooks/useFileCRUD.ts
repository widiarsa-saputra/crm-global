import { privateApi } from "@/api/api";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { DeleteFileResponse, DeleteFileResponseSchema } from "@/services/file";
import { FileStatisticsResponse, FileStatisticsResponseSchema } from "@/services/file";
import { FileUsageResponse, FileUsageResponseSchema } from "@/services/file";
import { IndexFileResponseSchema } from "@/services/file";
import { UpdateFileResponse, UpdateFileResponseSchema } from "@/services/file";
import { UploadFileResponse, UploadFileResponseSchema } from "@/services/file";
import { UpdateFile } from "@/services/file";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SingleFileResponse } from "../response/FileResponse";

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





interface FileStatisticsProps {
    enabled?: boolean;
}

export const useFileStatistics = (props?: FileStatisticsProps) => {
    return useQuery<FileStatisticsResponse>({
        queryKey: ['file-statistics'],
        queryFn: async (): Promise<FileStatisticsResponse> => {
            const response = await privateApi.get(`/${API_VERSION}/file-statistics`);
            return FileStatisticsResponseSchema.parse(response.data);
        },
        enabled: props?.enabled ?? true,
    });
};





interface FileUsageProps {
    enabled?: boolean;
}

export const useFileUsage = (props?: FileUsageProps) => {
    return useQuery<FileUsageResponse>({
        queryKey: ['file-usage'],
        queryFn: async (): Promise<FileUsageResponse> => {
            const response = await privateApi.get(`/${API_VERSION}/file-usages`);
            return FileUsageResponseSchema.parse(response.data);
        },
        enabled: props?.enabled ?? true,
    });
};





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





interface IndexFileProps {
    params?: { 
        search?: string;
        paginate?: number;
        page?: number;
        include?: string; // e.g., "folder,fileItems,posts"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

export const useIndexFile = (query: IndexFileProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/files`,
            params: query.params,
        },
        query: {
            key: "file-list",
        },
        schema: IndexFileResponseSchema,
    });





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





export const useUpdateFile = () => {
    return useBaseUpdate<UpdateFile, UpdateFileResponse, SingleFileResponse>({
        queryKey: 'file-list',
        endpoint: ({ id }) => `${API_VERSION}/files/${id}`,
        schema: UpdateFileResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error updating file:", error);
                throw error;
            },
        }
    });
};





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



