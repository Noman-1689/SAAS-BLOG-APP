// src/hooks/useImageMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

export const useGenerateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const response = await api.post("/api/images/generate", data);
      return response.data; // Returns { success: true, imagePreview: "data:image/jpeg;base64,..." }
    },
    onSuccess: () => {
      toast.success("Image generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["generated-images"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Failed to generate image";
      toast.error(errorMsg);
    },
  });
};
