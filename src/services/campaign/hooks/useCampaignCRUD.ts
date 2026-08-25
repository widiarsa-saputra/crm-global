import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { GeneralRes, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { IndexCampaignResponse, IndexCampaignResponseSchema, SingleCampaignResponse, SingleCampaignSchema } from "@/services/campaign";
import { CreateCampaignPayload, UpdateCampaignPayload } from "../schema/CampaignSchema";

export const useCreateCampaign = () => {
    return useBaseCreate<CreateCampaignPayload, SingleCampaignResponse, SingleCampaignResponse>({
        endpoint: `${API_VERSION}/blast-campaigns`,
        schema: SingleCampaignSchema,
        queryKey: "campaign-list",
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
        },
        schema: IndexCampaignResponseSchema,
    });





export const useUpdateCampaign = () => {
    return useBaseUpdate<UpdateCampaignPayload, SingleCampaignResponse, SingleCampaignResponse>({
        endpoint: `${API_VERSION}/blast-campaigns`,
        schema: SingleCampaignSchema,
        queryKey: "campaign-list",
    });
};



