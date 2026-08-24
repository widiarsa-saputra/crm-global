import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseInfiniteIndex from "@/services/base/hooks/useBaseInfiniteIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { CreateContactResponse, CreateContactResponseSchema } from "@/services/contacts";
import { DeleteContactResponse, DeleteContactResponseSchema } from "@/services/contacts";
import { IndexContactResponseSchema, SingleContactResponse } from "@/services/contacts";
import { ShowContactResponseSchema } from "@/services/contacts";
import { UpdateContactResponse, UpdateContactResponseSchema } from "@/services/contacts";
import { CreateContact } from "@/services/contacts";
import { UpdateContact } from "@/services/contacts";

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

const API_VERSION = "v1";

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

const API_VERSION = "v1";

interface IndexContactProps {
    params?: {
        segment_id?: string;
        search?: string;
        page?: number;
        [key: string]: unknown;
    };
}

const useIndexContact = (query: IndexContactProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            params: query.params,
        },
        query: {
            key: "contact-list",
        },
        schema: IndexContactResponseSchema,
    });

export default useIndexContact;

const API_VERSION = "v1";

interface IndexContactProps {
    params?: {
        segment_id?: string;
        search?: string;
        per_page?: number;
        [key: string]: unknown;
    };
}

const useIndexContactInfinite = (query: IndexContactProps) =>
    useBaseInfiniteIndex({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            params: query.params,
        },
        query: {
            key: "contact-list-infinite",
        },
        schema: IndexContactResponseSchema,
    });

export default useIndexContactInfinite;

const API_VERSION = "v1";

interface ShowContactProps {
    id: string;
}

const useShowContact = ({ id }: ShowContactProps) =>
    useBaseShow({
        request: {
            endpoint: `${API_VERSION}/contacts`,
            id,
        },
        query: {
            key: "contact-detail",
        },
        schema: ShowContactResponseSchema,
    });

export default useShowContact;

const API_VERSION = "v1";

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

