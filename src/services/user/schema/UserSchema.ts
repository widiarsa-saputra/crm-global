import { z } from "zod";
import { optionalEmailString, optionalMinString, optionalTrimmedString } from "@/lib/zod";

const CreateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export { CreateUserSchema };

export type CreateUser = z.infer<typeof CreateUserSchema>;

const UpdateUserSchema = z.object({
    name: optionalMinString(1, "Name is required"),
    email: optionalEmailString(),
    phone: optionalTrimmedString(),
    password: optionalMinString(8, "Password must be at least 8 characters long"),
});

export { UpdateUserSchema };

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
