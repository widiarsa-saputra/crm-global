import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { UpdateContact } from "@/services/contacts/schema/UpdateContactSchema";
import {
    UpdateContactResponse,
    UpdateContactResponseSchema,
} from "@/services/contacts/response/UpdateContactResponse";
import { SingleContactResponse } from "@/services/contacts/response/IndexContactResponse";

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
