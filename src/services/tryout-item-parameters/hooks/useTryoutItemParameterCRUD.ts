import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
    IrtCalculatePayload,
} from "../schema/TryoutItemParameterSchema";
import {
    TryoutItemParameterListResponseSchema,
    TryoutItemParameterShowResponseSchema,
    TryoutItemParameterListResponse,
    TryoutItemParameterShowResponse,
    IrtCalculateResponse,
    IrtCalculateResponseSchema,
} from "../response/TryoutItemParameterResponse";

const API_VERSION = "v1";
const queryKey = "tryout-item-parameters";

export const useTryoutItemParameterIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<TryoutItemParameterListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: TryoutItemParameterListResponseSchema,
        query: { key: queryKey },
    });
};

export const useTryoutItemParameterShow = (id: string | number) => {
    return useBaseShow<TryoutItemParameterShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: TryoutItemParameterShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

// Custom mutation — fire-and-forget, tidak memakai useBaseCreate karena tidak ada entity baru
export const useIrtCalculate = () => {
    const queryClient = useQueryClient();
    return useMutation<IrtCalculateResponse, Error, IrtCalculatePayload>({
        mutationFn: async (payload: IrtCalculatePayload) => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
            const res = await axios.post(`${baseUrl}/${API_VERSION}/calculate-irt`, payload);
            return IrtCalculateResponseSchema.parse(res.data);
        },
        onSuccess: (data) => {
            toast.success(data.data?.message ?? "Kalkulasi IRT berhasil dimasukkan ke antrean.", {
                description: data.data?.job_id ? `Job ID: ${data.data.job_id}` : undefined,
            });
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
        onError: (error) => {
            toast.error("Gagal memulai kalkulasi IRT.", {
                description: error.message,
            });
        },
    });
};
