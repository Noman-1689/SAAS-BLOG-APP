import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

const api = axios.create({
  baseURL,
  withCredentials: true, // Include cookies in requests
});

// Add an interceptor to include your Auth token automatically later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
