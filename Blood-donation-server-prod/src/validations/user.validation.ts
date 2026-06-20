import { z } from "zod";

// Blood group enum validation
const bloodGroupEnum = z.enum([
  "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG",
]);

// Gender enum validation
const genderEnum = z.enum(["male", "female", "other"]);

// User Registration Schema
export const userRegisterSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain uppercase letter"),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  address: z.string().min(5).max(255).optional(),
  bloodGroup: bloodGroupEnum,
  birthDate: z
    .string()
    .datetime()
    .refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 18 && age <= 100;
    }, "Age must be between 18 and 100"),
  gender: genderEnum,
});

// User Login Schema
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// User Profile Update Schema
export const userUpdateSchema = z.object({
  fullName: z.string().min(3).max(100).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/)
    .optional(),
  address: z.string().min(5).max(255).optional(),
  bloodGroup: bloodGroupEnum.optional(),
  gender: genderEnum.optional(),
});

// User Password Change Schema
export const userPasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain uppercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Export types
export type UserRegister = z.infer<typeof userRegisterSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserPasswordChange = z.infer<typeof userPasswordChangeSchema>;
