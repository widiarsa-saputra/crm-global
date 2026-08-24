import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleUserSchema } from "@/services/user/response/IndexUserResponse";

export const UserRoleSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display name is required"),
    users: z.array(SingleUserSchema).optional(),
});
export const CreateUserRoleResponseSchema = BaseResponseSchema(UserRoleSchema);
export type CreateUserRoleResponse = z.infer<typeof CreateUserRoleResponseSchema>;