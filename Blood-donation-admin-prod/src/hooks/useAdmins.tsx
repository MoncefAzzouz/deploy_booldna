import { api } from "../api/axios";

export default function useAdmins() {

  type CreateAdminPayload = {
    fullName: string;
    email: string;
    passwordHash: string;
    phone?: string;
    employeeId?: string;
    role?: string;
  };

  const validateCreateAdmin = (payload: CreateAdminPayload) => {
    const errors: Partial<Record<keyof CreateAdminPayload, string>> = {};

    if (!payload.fullName || payload.fullName.trim().length === 0) {
      errors.fullName = "Full name is required.";
    } else if (payload.fullName.length > 255) {
      errors.fullName = "Full name must be less than 255 characters.";
    }

    if (!payload.email || payload.email.trim().length === 0) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      errors.email = "Invalid email format.";
    }

    if (!payload.passwordHash || payload.passwordHash.length < 8) {
      errors.passwordHash = "Password must be at least 8 characters.";
    }

    if (payload.phone && !/^0\d{9}$/.test(payload.phone)) {
      errors.phone = "Phone must be 10 digits and start with 0.";
    }

    if (payload.employeeId && payload.employeeId.length > 50) {
      errors.employeeId = "Employee ID must be less than 50 characters.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const getAllAdmins = async () => {
    const response = await api.get("/admins/cts");
    return response.data;
  };

  const getAdminById = async (adminId: number) => {
    const response = await api.get(`/admins/cts/${adminId}`);
    return response.data;
  };

  const createAdmin = async (payload: CreateAdminPayload) => {
    const validation = validateCreateAdmin(payload);
    if (!validation.isValid) {
      const error: any = new Error("Client validation failed");
      error.validationErrors = validation.errors;
      throw error;
    }

    const response = await api.post("/admins/cts", payload);
    return response.data;
  };

  const activateAdmin = async (adminId: number) => {
    const response = await api.patch(`/admins/cts/${adminId}/activate`);
    return response.data;
  };

  const deactivateAdmin = async (adminId: number) => {
    const response = await api.patch(`/admins/cts/${adminId}/deactivate`);
    return response.data;
  };

  const deleteAdmin = async (adminId: number) => {
    const response = await api.delete(`/admins/cts/${adminId}`);
    return response.data;
  };

  return {
    validateCreateAdmin,
    getAllAdmins,
    getAdminById,
    createAdmin,
    activateAdmin,
    deactivateAdmin,
    deleteAdmin,
  };
}
