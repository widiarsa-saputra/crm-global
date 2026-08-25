import { z } from "zod";

export const statusEmailType = ["valid", "invalid", "bounced", "unsubscribed"] as const

const CreateContactSchema = z.object({
    nama: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    segment_id: z.string().nullable().optional(),
    email_status: z.enum(statusEmailType).optional(),
});

export { CreateContactSchema };

export type CreateContact = z.infer<typeof CreateContactSchema>;

const UpdateContactSchema = z.object({
    nama: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    company: z.string().optional(),
    segment_id: z.string().nullable().optional(),
    email_status: z.enum(statusEmailType).optional(),
});

export { UpdateContactSchema };

export type UpdateContact = z.infer<typeof UpdateContactSchema>;

