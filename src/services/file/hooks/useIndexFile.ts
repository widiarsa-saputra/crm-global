import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { IndexFileResponseSchema } from "@/services/file/response/IndexFileResponse";

const API_VERSION = "v1";

interface IndexFileProps {
    params?: { 
        search?: string;
        paginate?: number;
        page?: number;
        include?: string; // e.g., "folder,fileItems,posts"
        [key: string]: any;
    };
}

const useIndexFile = (query: IndexFileProps) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/files`,
            params: query.params,
        },
        query: {
            key: "file-list",
        },
        schema: IndexFileResponseSchema,
    });

export default useIndexFile;
