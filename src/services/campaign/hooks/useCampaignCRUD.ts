import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { GeneralRes, GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { IndexCampaignResponseSchema, SingleCampaignResponse, SingleCampaignSchema } from "@/services/campaign";
import { UpdateCampaignPayload } from "../schema/CampaignSchema";

const API_VERSION = "v1";

interface DeleteCampaignParams {
    id: number;
}

export const useDeleteCampaign = () => {
    return useBaseDelete<DeleteCampaignParams, GeneralRes, SingleCampaignResponse>({
        endpoint: ({ id }) => `${API_VERSION}/campaigns/${id}`,
        schema: GeneralResponseSchema,
        queryKey: "campaign-list",
    });
};





interface IndexCampaignProps {
    params?: { [key: string]: unknown };
}

export const useIndexCampaign = (query?: IndexCampaignProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/campaigns`,
            params: query?.params,
        },
        query: {
            key: "campaign-list",
        },
        schema: IndexCampaignResponseSchema,
    });





export const useUpdateCampaign = () => {
    return useBaseUpdate<UpdateCampaignPayload, SingleCampaignResponse, SingleCampaignResponse>({
        endpoint: `${API_VERSION}/campaigns`,
        schema: SingleCampaignSchema as any,
        queryKey: "campaign-list",
    });
};



