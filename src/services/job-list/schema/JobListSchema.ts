import { z } from "zod";

export const CreateJobListSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type CreateJobList = z.infer<typeof CreateJobListSchema>;

export const UpdateJobListSchema = z.object({
    id: z.number().or(z.string()),
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
});

export type UpdateJobList = z.infer<typeof UpdateJobListSchema>;
