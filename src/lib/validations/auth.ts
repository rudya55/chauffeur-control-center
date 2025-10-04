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
    .max(100, { message: "Le mot de passe est trop long" })
    .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom est trop long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
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
