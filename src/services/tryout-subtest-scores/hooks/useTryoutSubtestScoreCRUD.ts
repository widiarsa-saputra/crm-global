import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import {
    TryoutSubtestScoreListResponseSchema,
    TryoutSubtestScoreShowResponseSchema,
    TryoutSubtestScoreListResponse,
    TryoutSubtestScoreShowResponse,
} from "../response/TryoutSubtestScoreResponse";

const API_VERSION = "v1";
const queryKey = "tryout-subtest-scores";

export const useTryoutSubtestScoreIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<TryoutSubtestScoreListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: TryoutSubtestScoreListResponseSchema,
        query: { key: queryKey },
    });
};

export const useTryoutSubtestScoreShow = (id: string | number) => {
    return useBaseShow<TryoutSubtestScoreShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: TryoutSubtestScoreShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};
