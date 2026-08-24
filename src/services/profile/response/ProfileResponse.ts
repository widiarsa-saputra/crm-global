import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

const UserSchema = z.array(z.object({
    // definisikan properti user sesuai kebutuhan, contoh:
    id: z.string(),
    name: z.string(),
    email: z.string(),
    // dst...
})).nullable().optional();

export const ChangePasswordResponseSchema = BaseResponseSchema(UserSchema);

export type ChangePasswordResponse = z.infer<typeof ChangePasswordResponseSchema>;

const UserWithPhotoSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable(),
    phone: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    photo: z.string().nullable(),
    photo_url: z.string().url().nullable(),
});

export const ChangePhotoResponseSchema = BaseResponseSchema(UserWithPhotoSchema);

export type ChangePhotoResponse = z.infer<typeof ChangePhotoResponseSchema>;

const RoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

const PermissionSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
    group: z.string(),
});
export const GetUserLoginResponseSchema = BaseResponseSchema(UserSchema);

export type GetUserLoginResponse = z.infer<typeof GetUserLoginResponseSchema>;

export const GetUserLoginResponseSchemaWithoutBase = UserSchema;

export type GetUserLoginResponseWithoutBase = z.infer<typeof GetUserLoginResponseSchemaWithoutBase>;

export const ProfileSchema = z.object({});

export const UpdateProfileResponseSchema = BaseResponseSchema(ProfileSchema);

export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

