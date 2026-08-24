import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { EmailSettingSchema } from "../schema/EmailSettingSchema";

export const ShowEmailSettingResponseSchema = BaseResponseSchema(EmailSettingSchema);
export type ShowEmailSettingResponse = z.infer<typeof ShowEmailSettingResponseSchema>;
