import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { GetUserLoginResponseSchema } from "@/services/profile";
import { UpdateProfileResponse, UpdateProfileResponseSchema } from "@/services/profile";
import { UpdateProfile } from "@/services/profile";
import { ChangePasswordResponse, ChangePasswordResponseSchema, ChangePhotoResponse, ChangePhotoResponseSchema } from "../response/ProfileResponse";
import { ChangePassword, ChangePhoto } from "../schema/ProfileSchema";

const API_VERSION = "v1";

export const useChangePassword = () => {
    return useBaseUpdate<ChangePassword, ChangePasswordResponse, { id: string }>({
        queryKey: 'password-list',
        endpoint: () => `${API_VERSION}/change-password`, // Multiple params
        schema: ChangePasswordResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: ChangePasswordResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        }
    });
};

const API_VERSION = "v1";

export const useChangePhoto = () => {
    // *** INI PERUBAHANNYA ***
    // Ganti useBaseUpdate menjadi useBaseCreate
    return useBaseCreate<ChangePhoto, ChangePhotoResponse, { id: string }>({
        queryKey: 'profile-list',
        endpoint: `${API_VERSION}/change-photo`,
        schema: ChangePhotoResponseSchema,
        contentType: "multipart/form-data",
    });
};

const API_VERSION = "v1";

const useGetUserLogin = () =>
    useBaseIndex({
        query: {
            key: 'user',
        },
        request: {
            endpoint: `${API_VERSION}/me`,
        },
        schema: GetUserLoginResponseSchema,
    });

export default useGetUserLogin;

const API_VERSION = "v1";

export const useUpdateProfile = () => {
    return useBaseUpdate<UpdateProfile, UpdateProfileResponse, { id: string }>({
        queryKey: 'profile-list',
        endpoint: () => `${API_VERSION}/me`, // Multiple params
        schema: UpdateProfileResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data: UpdateProfileResponse) => data,
            onError: (error: unknown) => {
                throw error;
            },
        }
    });
};

