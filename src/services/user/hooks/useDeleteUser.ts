import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { DeleteUserResponse, DeleteUserResponseSchema } from "@/services/user/response/DeleteUserResponse";
import { User } from "@/shared/components/facebook-style-chat/types";

const API_VERSION = "v1";

export const useDeleteUser = () => {
    return useBaseDelete<{ id: string }, DeleteUserResponse, User>({

        endpoint: ({ id }) => `${API_VERSION}/users/${id}`,
        schema: DeleteUserResponseSchema,
        queryKey: "user-list",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                throw error;
            },
        }
    });
};