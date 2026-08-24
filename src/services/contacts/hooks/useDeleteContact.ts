import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import {
    DeleteContactResponse,
    DeleteContactResponseSchema,
} from "@/services/contacts/response/DeleteContactResponse";
import { SingleContactResponse } from "@/services/contacts/response/IndexContactResponse";

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
