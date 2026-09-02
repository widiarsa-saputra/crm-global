import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import {
    CreateContactResponse,
    CreateContactResponseSchema,
    DeleteContactResponse,
    DeleteContactResponseSchema,
    IndexContactResponse,
    IndexContactResponseSchema,
    ShowContactResponse,
    ShowContactResponseSchema,
    SingleContactResponse,
    UpdateContactResponse,
    UpdateContactResponseSchema,
    ImportContactResponse,
    ImportContactResponseSchema
} from "../response/ContactsResponse";
import { CreateContact, UpdateContact, ImportContact } from "../schema/ContactsSchema";
import { privateApi } from "@/api/api";
import useBaseInfiniteIndex from "@/services/base/hooks/useBaseInfiniteIndex";

const API_VERSION = "v1";

export const useCreateContact = () =>
    useBaseCreate<CreateContact, CreateContactResponse, SingleContactResponse>({
        endpoint: `${API_VERSION}/contacts`,
        schema: CreateContactResponseSchema,
        contentType: "application/json",
        queryKey: "contact-list",
        query: {
            onSuccess: (data: CreateContactResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });

export const useImportContacts = () =>
    useBaseCreate<ImportContact, ImportContactResponse, { id: string }>({
        endpoint: `${API_VERSION}/contacts/import`,
        schema: ImportContactResponseSchema,
        contentType: "multipart/form-data",
        queryKey: "contact-list",
        query: {
            onSuccess: (data: ImportContactResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });

export const downloadContactTemplate = async () => {
    const response = await privateApi.get(`/${API_VERSION}/contacts/template`, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contact_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const downloadImportResult = async (downloadId: string) => {
    const response = await privateApi.get(`/${API_VERSION}/contacts/download/${downloadId}`, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `import_result_${downloadId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};



interface DeleteContactParams {
    id: string;
}

export const useDeleteContact = () =>
    useBaseDelete<DeleteContactParams, DeleteContactResponse, SingleContactResponse>({
        endpoint: ({ id }) => `/${API_VERSION}/contacts/${id}`,
        schema: DeleteContactResponseSchema,
        queryKey: "contact-list",
        query: {
            onSuccess: (data: DeleteContactResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });



interface IndexContactProps {
    params?: {
        segment_id?: string;
        search?: string;
        page?: number;
        [key: string]: unknown;
    };
}

export const useIndexContact = (query: IndexContactProps) =>
    useBaseIndex<IndexContactResponse>({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            params: query.params,
        },
        query: {
            key: "contact-list",
        },
        schema: IndexContactResponseSchema,
    });





interface IndexContactInfiniteProps {
    params?: {
        segment_id?: string;
        search?: string;
        paginate?: number;
        [key: string]: unknown;
    };
}

export const useIndexContactInfinite = (query: IndexContactInfiniteProps) =>
    useBaseInfiniteIndex<IndexContactResponse>({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            params: query.params,
        },
        query: {
            key: "contact-list-infinite",
        },
        schema: IndexContactResponseSchema,
    });





interface ShowContactProps {
    id: string;
}

export const useShowContact = ({ id }: ShowContactProps) =>
    useBaseShow<ShowContactResponse>({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            id,
        },
        query: {
            key: "contact-detail",
        },
        schema: ShowContactResponseSchema,
    });





export const useUpdateContact = () =>
    useBaseUpdate<UpdateContact, UpdateContactResponse, SingleContactResponse>({
        endpoint: ({ id }) => `${API_VERSION}/contacts/${id}`,
        schema: UpdateContactResponseSchema,
        contentType: "application/json",
        queryKey: "contact-list",
        query: {
            onSuccess: (data: UpdateContactResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        },
    });


export const useCountBayesianEngagement = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, void>({
        mutationFn: async () => {
            const response = await privateApi.post(`/${API_VERSION}/contacts/count-bayesian-engagement`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-list"] });
        },
    });
};
