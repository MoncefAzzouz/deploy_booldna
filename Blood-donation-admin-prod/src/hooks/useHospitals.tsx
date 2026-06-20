import { api } from "../api/axios";

export default function useHospitals() {

  const getHospitals = async () => {
    try {
      const response = await api.get("/hospitals");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getHospitalById = async (hospitalId: number) => {
    try {
      const response = await api.get(`/hospitals/${hospitalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createHospital = async (payload: any) => {
    try {
      const response = await api.post("/hospitals", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateHospital = async (hospitalId: number, payload: any) => {
    try {
      const response = await api.put(
        `/hospitals/${hospitalId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteHospital = async (hospitalId: number) => {
    try {
      const response = await api.delete(`/hospitals/${hospitalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
  };
}
