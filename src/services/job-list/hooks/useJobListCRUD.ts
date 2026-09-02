import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { 
    DeleteJobListResponse, DeleteJobListResponseSchema,
    IndexJobListResponseSchema,
    JobList
} from "../response/JobListResponse";

const API_VERSION = "v1";


export const useDeleteJobList = () => {
    return useBaseDelete<{ id: number }, DeleteJobListResponse, JobList>({
        queryKey: 'job-list',
        endpoint: ({ id }) => `${API_VERSION}/engagement/jobs/${id}`,
        schema: DeleteJobListResponseSchema,
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                throw error;
            },
        }
    });
};

interface IndexJobListProps {
    params?: object;
}

export const useIndexJobList = (query: IndexJobListProps = {}) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/engagement/jobs`,
            params: query.params,
        },
        query: {
            key: "job-list",
        },
        schema: IndexJobListResponseSchema,
    });


