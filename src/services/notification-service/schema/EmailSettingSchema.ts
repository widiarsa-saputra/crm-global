import { z } from "zod";

export const EmailSettingSchema = z.object({
    id: z.string(),
    type: z.string(),
    json: z.object({
        mailer: z.string().optional(),
        host: z.string(),
        port: z.union([z.string(), z.number()]),
        username: z.string(),
        encryption: z.string(),
        from_address: z.string(),
        from_name: z.string(),
        reply_to_address: z.string().optional().nullable(),
        reply_to_name: z.string().optional().nullable(),
        timeout: z.union([z.string(), z.number()]).optional(),
        has_password: z.boolean().optional()
    })
});

export type EmailSetting = z.infer<typeof EmailSettingSchema>;
