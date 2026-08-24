import { z } from "zod";
import { SingleFileSchema } from "./IndexFileResponse";

export const UploadFileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    code: z.number(),
    data: SingleFileSchema,
});

export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;
