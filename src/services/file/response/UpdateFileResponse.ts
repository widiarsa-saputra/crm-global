import { z } from "zod";
import { SingleFileSchema } from "./IndexFileResponse";

export const UpdateFileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: SingleFileSchema,
});

export type UpdateFileResponse = z.infer<typeof UpdateFileResponseSchema>;
