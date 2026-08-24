import { z } from "zod";

const CreateContactSchema = z.object({
    nama: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    segment_id: z.string().nullable().optional(),
    email_status: z.enum(["valid", "invalid", "bounced", "unsubscribed"]).optional(),
});

export { CreateContactSchema };
export type CreateContact = z.infer<typeof CreateContactSchema>;
