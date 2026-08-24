import { z } from "zod";

const ChangePasswordSchema = z.object({
    old_password: z.string().min(8, { message: "Old password is required" }),
    new_password: z.string().min(8, { message: "New password is required" }),
})

export { ChangePasswordSchema };
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;