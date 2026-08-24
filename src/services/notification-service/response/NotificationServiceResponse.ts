import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { z } from "zod";
import { EmailSettingSchema, WhatsappSessionSchema } from "../schema/NotificationServiceSchema";

export const ShowEmailSettingResponseSchema = BaseResponseSchema(EmailSettingSchema);

export type ShowEmailSettingResponse = z.infer<typeof ShowEmailSettingResponseSchema>;

export const ShowWhatsappSessionResponseSchema = BaseResponseSchema(WhatsappSessionSchema);

export type ShowWhatsappSessionResponse = z.infer<typeof ShowWhatsappSessionResponseSchema>;

