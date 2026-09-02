import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { 
    CreateJobListResponse, CreateJobListResponseSchema,
    DeleteJobListResponse, DeleteJobListResponseSchema,
    IndexJobListResponseSchema,
    UpdateJobListResponse, UpdateJobListResponseSchema,
    JobList
} from "../response/JobListResponse";
import { CreateJobList, UpdateJobList } from "../schema/JobListSchema";

const API_VERSION = "v1";

export function useCreateJobList() {
    return useBaseCreate<CreateJobList, CreateJobListResponse, JobList>({
        queryKey: 'job-list',
        endpoint: `${API_VERSION}/job-lists`,
        schema: CreateJobListResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error creating job list:", error);
                throw error;
            },
        }
    });
}

export const useDeleteJobList = () => {
    return useBaseDelete<{ id: number }, DeleteJobListResponse, JobList>({
        queryKey: 'job-list',
        endpoint: ({ id }) => `${API_VERSION}/job-lists/${id}`,
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
    params?: { [key: string]: object };
}

export const useIndexJobList = (query: IndexJobListProps = {}) =>
    useBaseIndex({
        request: {
            endpoint: `${API_VERSION}/job-lists`,
            params: query.params,
        },
        query: {
            key: "job-list",
        },
        schema: IndexJobListResponseSchema,
    });

export const useUpdateJobList = () => {
    return useBaseUpdate<UpdateJobList, UpdateJobListResponse, JobList>({
        queryKey: 'job-list',
        endpoint: ({ id }) => `${API_VERSION}/job-lists/${id}`,
        schema: UpdateJobListResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: UpdateJobListResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        }
    });
};
