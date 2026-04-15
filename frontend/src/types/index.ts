export interface ImageGenerateResponse {
  success: boolean;
  imagePreview: string; // The base64 string
}

export interface ApiError {
  error: string;
}
export interface AuthResponse {
  message: string;
  error?: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
