import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const ProfileSchema = z.object({});
export const UpdateProfileResponseSchema = BaseResponseSchema(ProfileSchema);
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;