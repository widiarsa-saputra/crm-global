import { z } from "zod";
import { optionalMinString } from "@/lib/zod";

const CreateRoleSchema = z.object({
    display_name: z.string().min(1, "Display name is required"),
    name: z.string().min(1, "Name is required"),
});

export { CreateRoleSchema };

export type CreateRole = z.infer<typeof CreateRoleSchema>;

const UpdateRoleSchema = z.object({
    display_name: optionalMinString(1, "Display name is required"),
});

export { UpdateRoleSchema };

export type UpdateRole = z.infer<typeof UpdateRoleSchema>;
