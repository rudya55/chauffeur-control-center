import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "L'email est trop long" }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    .max(100, { message: "Le mot de passe est trop long" }),
});

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "L'email est trop long" }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    .max(100, { message: "Le mot de passe est trop long" }),
  name: z
    .string()
    .trim()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom est trop long" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Le numéro de téléphone est invalide" })
    .max(20, { message: "Le numéro de téléphone est trop long" }),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" })
    .max(255, { message: "L'email est trop long" }),
});

export const documentRejectionSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, { message: "La raison doit contenir au moins 10 caractères" })
    .max(500, { message: "La raison est trop longue (max 500 caractères)" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type DocumentRejectionFormData = z.infer<typeof documentRejectionSchema>;
