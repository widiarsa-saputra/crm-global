import { z } from "zod";

const UpdateProfileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
});

export { UpdateProfileSchema };
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;