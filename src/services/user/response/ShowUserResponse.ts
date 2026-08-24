import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const UserSchema = z.object({});
export const ShowUserResponseSchema = BaseResponseSchema(UserSchema);
export type ShowUserResponse = z.infer<typeof ShowUserResponseSchema>;