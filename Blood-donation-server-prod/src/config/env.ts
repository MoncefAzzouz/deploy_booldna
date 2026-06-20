import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default(3000),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  JWT_SECRET: z.string().min(1, "JWT secret is required"),
  RESEND_API_KEy: z.string().min(1, "Resend API Key is required"),
  CLIENT_URL: z.string().min(1, "client url  is required"),
  EMAIL_USER: z.string().min(1, "Email user is required"),
  EMAIL_PASS: z.string().min(1, "Email password is required"),
});

// Validate and parse environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

// Type for environment variables
export type Env = z.infer<typeof envSchema>;
