import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";

export const PermissionSchema = z.object({});
export const ShowPermissionResponseSchema = BaseResponseSchema(PermissionSchema);
export type ShowPermissionResponse = z.infer<typeof ShowPermissionResponseSchema>;