import { z } from 'zod';

export const loginSchema = z.object({
    loginMethod: z.enum(['email', 'username']),
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(1, 'Password is required'), // Kita bisa buat validasi dasar di sini
})
    .superRefine((data, ctx) => {
        if (data.loginMethod === 'email') {
            const emailValidation = z.string().min(1, 'Email is required').email('Invalid email address');
            const result = emailValidation.safeParse(data.email);
            if (!result.success) {
                result.error.issues.forEach(issue => {
                    ctx.addIssue({
                        ...issue,
                        path: ['email'], // Pastikan error ditambahkan ke path 'email'
                    });
                });
            }
        } else if (data.loginMethod === 'username') {
            const usernameValidation = z.string().min(3, 'Username must be at least 3 characters');
            const result = usernameValidation.safeParse(data.username);
            if (!result.success) {
                result.error.issues.forEach(issue => {
                    ctx.addIssue({
                        ...issue,
                        path: ['username'], // Pastikan error ditambahkan ke path 'username'
                    });
                });
            }
        }

        // Validasi password bisa lebih kompleks di sini jika perlu
        if (data.password.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must be at least 6 characters",
                path: ['password']
            });
        }
    });

// Tipenya sekarang adalah satu objek, bukan union!
export type LoginPayload = z.infer<typeof loginSchema>;