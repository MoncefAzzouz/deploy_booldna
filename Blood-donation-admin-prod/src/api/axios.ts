import axios from "axios";
import { store } from "../state/store";
import { removeSession } from "../state/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("adminSession");
      store.dispatch(removeSession());
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);
