// src/auth/schema/registerSchemas.ts
import { z } from 'zod';

export const registerSchema = z
    .object({
        name: z.string().min(1, 'Full name is required'),
        email: z.string().min(1, 'Email is required').email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        password_confirmation: z.string().min(1, 'Please confirm your password'),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.password_confirmation) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Passwords do not match',
                path: ['password_confirmation'],
            });
        }
    });

export type RegisterPayload = z.infer<typeof registerSchema>;
