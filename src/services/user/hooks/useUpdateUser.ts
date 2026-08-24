import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { UpdateUser } from "@/services/user/schema/UpdateUserSchema";
import { UpdateUserResponse, UpdateUserResponseSchema } from "@/services/user/response/UpdateUserResponse";
import { User } from "@/shared/components/facebook-style-chat/types";

const API_VERSION = "v1";

export const useUpdateUser = () => {
    return useBaseUpdate<UpdateUser, UpdateUserResponse, User>({
        endpoint: ({ id }) => `${API_VERSION}/users/${id}`,
        schema: UpdateUserResponseSchema,
        contentType: "application/json",
        queryKey: 'user-list',
        query: {
            onSuccess: (data: UpdateUserResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        }
    });
};
