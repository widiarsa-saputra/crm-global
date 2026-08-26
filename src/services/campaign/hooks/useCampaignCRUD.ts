import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { GeneralRes, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { IndexCampaignResponse, IndexCampaignResponseSchema, SingleCampaignResponse, SingleCampaignResponseSchema, SingleCampaignResponseWrapped, IndexCampaignContactResponseSchema, IndexCampaignContactResponse } from "@/services/campaign";
import { CreateCampaignPayload, UpdateCampaignPayload } from "../schema/CampaignSchema";
import { keepPreviousData } from "@tanstack/react-query";

export const useCreateCampaign = () => {
    return useBaseCreate<CreateCampaignPayload, SingleCampaignResponseWrapped, SingleCampaignResponse>({
        endpoint: `${API_VERSION}/blast-campaigns`,
        schema: SingleCampaignResponseSchema,
        queryKey: "campaign-list",
        query: {
            onSuccess: (data: SingleCampaignResponseWrapped) => data.data,
            onError: (error: unknown) => { throw error; },
        }
    });
};

const API_VERSION = "v1";

interface DeleteCampaignParams {
    id: number;
}

export const useDeleteCampaign = () => {
    return useBaseDelete<DeleteCampaignParams, GeneralRes, SingleCampaignResponse>({
        endpoint: ({ id }) => `${API_VERSION}/blast-campaigns/${id}`,
        schema: GeneralResponseSchema,
        queryKey: "campaign-list",
    });
};





interface IndexCampaignProps {
    params?: { [key: string]: unknown };
}

export const useIndexCampaign = (query?: IndexCampaignProps) =>
    useBaseIndex<IndexCampaignResponse>({
        request: {
            endpoint: `${API_VERSION}/blast-campaigns`,
            params: query?.params,
        },
        query: {
            key: "campaign-list",
            placeholderData: keepPreviousData
        },
        schema: IndexCampaignResponseSchema,
    });


export const useIndexCampaignContact = (query?: IndexCampaignProps) =>
    useBaseIndex<IndexCampaignContactResponse>({
        request: {
            endpoint: `${API_VERSION}/campaign-contacts`,
            params: query?.params,
        },
        query: {
            key: `campaign-contacts-${JSON.stringify(query?.params)}`,
            placeholderData: keepPreviousData,
        },
        schema: IndexCampaignContactResponseSchema,
    });

export const useUpdateCampaign = () => {
    return useBaseUpdate<UpdateCampaignPayload, SingleCampaignResponseWrapped, SingleCampaignResponse>({
        endpoint: `${API_VERSION}/blast-campaigns`,
        schema: SingleCampaignResponseSchema,
        queryKey: "campaign-list",
        query: {
            onSuccess: (data: SingleCampaignResponseWrapped) => data.data,
            onError: (error: unknown) => { throw error; },
        }
    });
};


