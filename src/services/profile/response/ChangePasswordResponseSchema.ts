import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";

const UserSchema = z.array(z.object({
    // definisikan properti user sesuai kebutuhan, contoh:
    id: z.string(),
    name: z.string(),
    email: z.string(),
    // dst...
})).nullable().optional();

// Apply the base schema for a single user response
export const ChangePasswordResponseSchema = BaseResponseSchema(UserSchema);
export type ChangePasswordResponse = z.infer<typeof ChangePasswordResponseSchema>;