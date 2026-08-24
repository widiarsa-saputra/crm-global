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

const useDeleteCampaign = () => {
    return useBaseDelete<DeleteCampaignParams, GeneralRes, SingleCampaignResponse>({
        endpoint: ({ id }) => `${API_VERSION}/campaigns/${id}`,
        schema: GeneralResponseSchema,
        queryKey: "campaign-list",
    });
};

export default useDeleteCampaign;

const API_VERSION = "v1";

interface IndexCampaignProps {
    params?: { [key: string]: unknown };
}

const useIndexCampaign = (query?: IndexCampaignProps) =>
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

export default useIndexCampaign;

const API_VERSION = "v1";

const useUpdateCampaign = () => {
    return useBaseUpdate<UpdateCampaignPayload, SingleCampaignResponse, SingleCampaignResponse>({
        endpoint: `${API_VERSION}/campaigns`,
        schema: SingleCampaignSchema,
        queryKey: "campaign-list",
    });
};

export default useUpdateCampaign;

