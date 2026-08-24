import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { UpdateFile } from "@/services/file/schema/UpdateFileSchema";
import { UpdateFileResponse, UpdateFileResponseSchema } from "@/services/file/response/UpdateFileResponse";
import { SingleFileResponse } from "../response/IndexFileResponse";

const API_VERSION = "v1";

export const useUpdateFile = () => {
    return useBaseUpdate<UpdateFile, UpdateFileResponse, SingleFileResponse>({
        queryKey: 'file-list',
        endpoint: ({ id }) => `${API_VERSION}/files/${id}`,
        schema: UpdateFileResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error updating file:", error);
                throw error;
            },
        }
    });
};

export default useUpdateFile;
