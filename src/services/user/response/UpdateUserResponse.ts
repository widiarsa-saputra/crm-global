import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const UserSchema = z.object({});
export const UpdateUserResponseSchema = BaseResponseSchema(UserSchema);
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;