import { z } from "zod";
import { optionalEmailString, optionalTrimmedString } from "@/lib/zod";

export const statusEmailType = ["valid", "unsubscribed", "blocked"] as const

const CreateContactSchema = z.object({
    nama: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    segment_id: z.string().nullable().optional(),
    email_status: z.enum(statusEmailType).optional(),
    location: z.string().optional(),
    fax: z.string().optional(),
});

export { CreateContactSchema };

export type CreateContact = z.infer<typeof CreateContactSchema>;

const UpdateContactSchema = z.object({
    nama: optionalTrimmedString(),
    email: optionalEmailString(),
    company: optionalTrimmedString(),
    segment_id: z.string().nullable().optional(),
    email_status: z.enum(statusEmailType).optional(),
    location: optionalTrimmedString(),
    fax: optionalTrimmedString(),
});

export { UpdateContactSchema };

export type UpdateContact = z.infer<typeof UpdateContactSchema>;

export type ImportContact = {
    file: File;
};
