import { z } from "zod";

export const optionalTrimmedString = () =>
    z
        .string()
        .trim()
        .transform((value) => (value === "" ? undefined : value))
        .optional();

export const optionalEmailString = () =>
    z
        .string()
        .trim()
        .refine(
            (value) => value === "" || z.string().email().safeParse(value).success,
            "Invalid email address"
        )
        .transform((value) => (value === "" ? undefined : value))
        .optional();

export const optionalMinString = (min: number, message: string) =>
    z
        .string()
        .trim()
        .refine((value) => value === "" || value.length >= min, message)
        .transform((value) => (value === "" ? undefined : value))
        .optional();
