import { z } from "zod";

export const WhatsappSessionSchema = z.object({
    id: z.string(),
    type: z.string(),
    json: z.object({
        session_id: z.string()
    })
});

export type WhatsappSession = z.infer<typeof WhatsappSessionSchema>;
