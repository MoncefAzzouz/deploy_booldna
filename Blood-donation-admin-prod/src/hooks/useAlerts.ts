import { api } from "../api/axios";

export type CreateAlertPayload = {
  hospitalId?: number;
  bloodGroup: string;
  quantityUnits: number;
  urgencyLevel: "low" | "medium" | "urgent";
  description?: string;
};

export type UpdateAlertPayload = {
  alertId: number;
  status?: "active" | "recovered";
  hospitalId?: number;
  bloodGroup?: string;
  quantityUnits?: number;
  urgencyLevel?: "low" | "medium" | "urgent";
  description?: string;
};

export default function useAlerts() {
  const getAllAlerts = async () => {
    const response = await api.get("/alerts");
    return response.data.data;
  };

  const getAlertById = async (alertId: number) => {
    const response = await api.get(`/alerts/${alertId}`);
    return response.data;
  };

  const createAlert = async (adminId: number, payload: CreateAlertPayload) => {
    const response = await api.post(`/alerts/admin/${adminId}`, payload);
    return response.data;
  };

  const updateAlert = async (adminId: number, payload: UpdateAlertPayload) => {
    const response = await api.put(`/alerts/admin/${adminId}`, payload);
    return response.data;
  };

  const deleteAlert = async (alertId: number) => {
    const response = await api.delete(`/alerts/${alertId}`);
    return response.data;
  };

  return {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert,
  };
}
