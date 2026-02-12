import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    medicalSpec: z.string().optional(),
    hospital: z.string().optional(),
    slmcNumber: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, "Email or phone is required"),
  }),
});

export const verifyOTPSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, "Email or phone is required"),
    code: z.string().length(4, "OTP must be 4 digits"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, "Email or phone is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
