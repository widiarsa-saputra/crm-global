import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/api/api";
import { FileStatisticsResponse, FileStatisticsResponseSchema } from "@/services/file/response/FileStatisticsResponse";

const API_VERSION = "v1";

interface FileStatisticsProps {
    enabled?: boolean;
}

const useFileStatistics = (props?: FileStatisticsProps) => {
    return useQuery<FileStatisticsResponse>({
        queryKey: ['file-statistics'],
        queryFn: async (): Promise<FileStatisticsResponse> => {
            const response = await privateApi.get(`/${API_VERSION}/file-statistics`);
            return FileStatisticsResponseSchema.parse(response.data);
        },
        enabled: props?.enabled ?? true,
    });
};

export default useFileStatistics;
