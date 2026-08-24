import { z } from "zod";

// Skema untuk memvalidasi input form
export const ChangePhotoSchema = z.object({
    // Validasi untuk file foto, memastikan file dipilih
    photo: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "A photo is required."),
    // Method untuk spoofing PUT/PATCH request
    _method: z.string().default("PUT"),
});

export type ChangePhoto = z.infer<typeof ChangePhotoSchema>;