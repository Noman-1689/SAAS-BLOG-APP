import api from "@/lib/axios";
import { ImageGenerateResponse } from "@/types";

export const generateImage = async (title: string, description: string) => {
  const response = await api.post<ImageGenerateResponse>(
    "/api/images/generate",
    {
      title,
      description,
    },
  );
  return response.data;
};
