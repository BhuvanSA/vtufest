import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 12 characters")
        .min(1, "Password is required"),
});
