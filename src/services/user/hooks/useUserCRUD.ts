import { privateApi } from "@/api/api";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { CreateUserResponse, CreateUserResponseSchema } from "@/services/user";
import { DeleteUserResponse, DeleteUserResponseSchema } from "@/services/user";
import { IndexUserResponseSchema } from "@/services/user";
import { UpdateUserResponse, UpdateUserResponseSchema } from "@/services/user";
import { CreateUser } from "@/services/user";
import { UpdateUser } from "@/services/user";
import { User } from "@/shared/components/facebook-style-chat/types";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const API_VERSION = "v1";

export default function useCreateUser() {
    return useBaseCreate<CreateUser, CreateUserResponse, User>({
        queryKey: "user-list",
        endpoint: `${API_VERSION}/users`,
        schema: CreateUserResponseSchema,
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

const API_VERSION = "v1";

export const useDeleteUser = () => {
    return useBaseDelete<{ id: string }, DeleteUserResponse, User>({

        endpoint: ({ id }) => `${API_VERSION}/users/${id}`,
        schema: DeleteUserResponseSchema,
        queryKey: "user-list",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                throw error;
            },
        }
    });
};

const API_VERSION = "v1";

const useDownloadImportTemplate = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await privateApi.get(`/${API_VERSION}/users/import-template`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users-import-template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return response.data;
        }
    });
};

export default useDownloadImportTemplate;

const API_VERSION = "v1";

const useExportUsers = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await privateApi.get(`/${API_VERSION}/users/export`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return response.data;
        }
    });
};

export default useExportUsers;

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

const API_VERSION = "v1";

interface IndexUserProps {
    params?: { [key: string]: any };
}

const useIndexUser = (query: IndexUserProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/users`,
            params: query.params,
        },
        query: {
            key: "user-list"
        },
        schema: IndexUserResponseSchema,
    });

export default useIndexUser;

const API_VERSION = "v1";

interface PreviewImportPayload {
    file: File;
}

const usePreviewUserImport = () => {
    return useBaseCreate<PreviewImportPayload, any, User>({
        queryKey: 'preview-import-user',
        endpoint: `${API_VERSION}/users/import-preview`,
        contentType: "multipart/form-data",
        schema: z.any(), // Using any for now to be flexible with response
    });
};

export default usePreviewUserImport;

const API_VERSION = "v1";

export const useUpdateUser = () => {
    return useBaseUpdate<UpdateUser, UpdateUserResponse, User>({
        endpoint: ({ id }) => `${API_VERSION}/users/${id}`,
        schema: UpdateUserResponseSchema,
        contentType: "application/json",
        queryKey: 'user-list',
        query: {
            onSuccess: (data: UpdateUserResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        }
    });
};

