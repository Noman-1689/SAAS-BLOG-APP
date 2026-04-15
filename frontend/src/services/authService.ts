import api from "@/lib/axios";
import { AuthResponse, SignupData } from "@/types";

export const registerUser = async (data: SignupData): Promise<AuthResponse> => {
  // This calls your 'export const signup' controller on the backend
  const response = await api.post<AuthResponse>("/api/auth/signup", data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  // This calls your 'export const login' controller on the backend
  const response = await api.post<AuthResponse>("/api/auth/login", data);
  return response.data;
};

export const loginWithGoogle = () => {
  // This triggers your 'googleAuthCallback' flow
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
};
