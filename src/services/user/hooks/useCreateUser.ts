import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { CreateUser } from "@/services/user/schema/CreateUserSchema";
import { CreateUserResponse, CreateUserResponseSchema } from "@/services/user/response/CreateUserResponse";
import { User } from "@/shared/components/facebook-style-chat/types";

const API_VERSION = "v1";

export default function useCreateUser() {
    return useBaseCreate<CreateUser, CreateUserResponse, User>({
        queryKey: "user-list",
        endpoint: `${API_VERSION}/users`,
        schema: CreateUserResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error creating user:", error);
                throw error;
            },
        }
    });
}