import { z } from "zod";

const ChangePasswordSchema = z.object({
    old_password: z.string().min(8, { message: "Old password is required" }),
    new_password: z.string().min(8, { message: "New password is required" }),
})

export { ChangePasswordSchema };

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

export const ChangePhotoSchema = z.object({
    // Validasi untuk file foto, memastikan file dipilih
    photo: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "A photo is required."),
    // Method untuk spoofing PUT/PATCH request
    _method: z.string().default("PUT"),
});

export type ChangePhoto = z.infer<typeof ChangePhotoSchema>;

const UpdateProfileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
});

export { UpdateProfileSchema };

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

