import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import {
    StudentProgressListResponseSchema,
    StudentProgressShowResponseSchema,
    StudentProgressListResponse,
    StudentProgressShowResponse,
} from "../response/StudentProgressResponse";
import { StudentProgressCalculatePayload } from "../schema/StudentProgressSchema";

const API_VERSION = "v1";
const queryKey = "student-progress";

export const useStudentProgressIndex = (params?: Record<string, unknown>) => {
    return useBaseIndex<StudentProgressListResponse>({
        request: { endpoint: `${API_VERSION}/${queryKey}`, params },
        schema: StudentProgressListResponseSchema,
        query: { key: queryKey },
    });
};

export const useStudentProgressShow = (id: string | number) => {
    return useBaseShow<StudentProgressShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
        },
        schema: StudentProgressShowResponseSchema,
        query: { key: `${queryKey}-${id}` },
    });
};

export const useStudentProgressCalculate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: StudentProgressCalculatePayload) =>
            axios.post(`${API_VERSION}/calculate-student-progress`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });
};
