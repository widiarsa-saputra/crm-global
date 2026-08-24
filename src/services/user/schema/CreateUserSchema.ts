import { z } from "zod";

const CreateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export { CreateUserSchema };
export type CreateUser = z.infer<typeof CreateUserSchema>;