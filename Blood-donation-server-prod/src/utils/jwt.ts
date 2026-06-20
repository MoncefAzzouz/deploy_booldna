import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateUserToken = (userId: number, email: string) => {
  return jwt.sign({ userId, email, type: "user" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export function createEmailVerifyToken(userId: number) {
  return jwt.sign({ userId, type: "email-verify" }, env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export const generateAdminToken = (
  adminId: number,
  email: string,
  role: string
) => {
  return jwt.sign(
    { adminId, email, role, type: "admin" }, // type to be viewed discussed.
    env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};
