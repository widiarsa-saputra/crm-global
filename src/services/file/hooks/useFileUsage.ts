import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/api/api";
import { FileUsageResponse, FileUsageResponseSchema } from "@/services/file/response/FileUsageResponse";

const API_VERSION = "v1";

interface FileUsageProps {
    enabled?: boolean;
}

const useFileUsage = (props?: FileUsageProps) => {
    return useQuery<FileUsageResponse>({
        queryKey: ['file-usage'],
        queryFn: async (): Promise<FileUsageResponse> => {
            const response = await privateApi.get(`/${API_VERSION}/file-usages`);
            return FileUsageResponseSchema.parse(response.data);
        },
        enabled: props?.enabled ?? true,
    });
};

export default useFileUsage;
