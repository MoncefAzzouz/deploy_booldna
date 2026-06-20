export default interface LoginPayload {
  email: string;
  password: string;
}

// Fixed: role type was "admin" | "super-admin" (with hyphens) but the backend
// Prisma schema uses "admin_cts" | "super_admin" (with underscores).
// This caused the MainRouter role check to fail after login.
export interface AdminCTS {
  adminId: number;
  fullName: string;
  email: string;
  phone?: string;
  lastLoginAt: string;
  role: "admin_cts" | "super_admin"
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: { resAdmin: AdminCTS; token: string; };
  timestamp: string;
}
