import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { CreateContact } from "@/services/contacts/schema/CreateContactSchema";
import {
    CreateContactResponse,
    CreateContactResponseSchema,
} from "@/services/contacts/response/CreateContactResponse";
import { SingleContactResponse } from "@/services/contacts/response/IndexContactResponse";

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
