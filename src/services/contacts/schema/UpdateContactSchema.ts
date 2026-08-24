import { z } from "zod";

const UpdateContactSchema = z.object({
    nama: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    company: z.string().optional(),
    segment_id: z.string().nullable().optional(),
    email_status: z.enum(["valid", "invalid", "bounced", "unsubscribed"]).optional(),
});

export { UpdateContactSchema };
export type UpdateContact = z.infer<typeof UpdateContactSchema>;
