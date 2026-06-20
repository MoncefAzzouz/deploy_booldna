import { api } from "../api/axios";

export default function useDonations() {

  const getAllDonations = async () => {
    try {
      const response = await api.get("/donations");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getDonationById = async (donationId: number) => {
    try {
      const response = await api.get(`/donations/${donationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateDonationStatus = async (
    adminId: number,
    payload: {
      donationId: number;
      status: "planned" | "confirmed" | "cancelled";
      notes?: string;
    }
  ) => {
    try {
      const response = await api.put(
        `/donations/admin/${adminId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getAllDonations,
    getDonationById,
    updateDonationStatus,
  };
}
