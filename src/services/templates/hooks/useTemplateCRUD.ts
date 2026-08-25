import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { GeneralRes, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { IndexTemplateResponseSchema, SingleTemplateResponse, SingleTemplateResponseSchema, SingleTemplateResponseWrapped } from "../response/TemplateResponse";
import { CreateTemplatePayload, UpdateTemplatePayload } from "../schema/TemplateSchema";

interface IndexTemplateProps {
    params?: { [key: string]: unknown };
}

export const useIndexTemplate = (query?: IndexTemplateProps) => {
    return useBaseIndex({
        request: {
            endpoint: "v1/message-templates",
            params: query?.params,
        },
        query: {
            key: "template-list",
        },
        schema: IndexTemplateResponseSchema,
    });
};

export const useCreateTemplate = () => {
    return useBaseCreate<CreateTemplatePayload, SingleTemplateResponseWrapped, SingleTemplateResponse>({
        endpoint: "v1/message-templates",
        queryKey: "template-list",
        schema: SingleTemplateResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: SingleTemplateResponseWrapped) => data.data,
            onError: (error: unknown) => { throw error; },
        }
    });
};

export const useUpdateTemplate = () => {
    return useBaseUpdate<UpdateTemplatePayload, SingleTemplateResponseWrapped, SingleTemplateResponse>({
        endpoint: ({ id }: { id: string | number }) => `v1/message-templates/${id}`,
        queryKey: "template-list",
        schema: SingleTemplateResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: SingleTemplateResponseWrapped) => data.data,
            onError: (error: unknown) => { throw error; },
        }
    });
};

export const useDeleteTemplate = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, SingleTemplateResponse>({
        endpoint: ({ id }: { id: string | number }) => `/v1/message-templates/${id}`,
        queryKey: "template-list",
        schema: GeneralResponseSchema,
        query: {
            onSuccess: (data: GeneralRes) => data,
            onError: (error: unknown) => { throw error; },
        }
    });
};
