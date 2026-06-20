import type { ApiDonation } from "../types/donors";
import { api } from "../api/axios";


export async function getAllDonationsRaw(): Promise<ApiDonation[]> {
  const resp = await api.get("/donations"); // change endpoint if needed
  const maybe = resp.data ?? resp;
  if (Array.isArray(maybe)) return maybe as ApiDonation[];
  if (Array.isArray(maybe.data)) return maybe.data as ApiDonation[];
  if (Array.isArray(maybe.data?.data)) return maybe.data.data as ApiDonation[];

  const arr = Object.values(maybe).find((v) => Array.isArray(v)) as ApiDonation[] | undefined;
  if (arr) return arr;
  return [];
}
export async function updateDonation(adminId: number, payload: { donationId: number; status?: "planned" | "confirmed" | "cancelled"; notes?: string }) {
  const response = await api.put(`/donations/admin/${adminId}`, payload);
  return response.data;
}
