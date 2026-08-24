import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    id: z.string(),
    updated_at: z.string(),
    created_at: z.string(),
});
export const CreateUserResponseSchema = BaseResponseSchema(UserSchema);
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;