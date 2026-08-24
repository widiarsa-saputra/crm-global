import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const UserSchema = z.nullable(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string()
})).optional();
export const DeleteUserResponseSchema = BaseResponseSchema(UserSchema);
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;