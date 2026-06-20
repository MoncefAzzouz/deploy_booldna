import { api } from "../api/axios";
import type { LoginResponse } from "../types/loginTypes";
import type LoginPayload from "../types/loginTypes";

export const loginAdmin = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>("/admins/cts/login", payload);
  return response.data;
};
