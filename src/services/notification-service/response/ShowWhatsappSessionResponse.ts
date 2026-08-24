import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { WhatsappSessionSchema } from "../schema/WhatsappSessionSchema";

export const ShowWhatsappSessionResponseSchema = BaseResponseSchema(WhatsappSessionSchema);
export type ShowWhatsappSessionResponse = z.infer<typeof ShowWhatsappSessionResponseSchema>;
