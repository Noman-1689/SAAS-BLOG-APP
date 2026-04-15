import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

export const useReviewResume = () => {
  return useMutation({
    mutationFn: async ({
      resumeText,
      field,
    }: {
      resumeText: string;
      field: string;
    }) => {
      const response = await api.post("/api/resumes/review", {
        resumeText,
        field,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Resume analyzed successfully!");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Failed to analyze resume";
      toast.error(errorMsg);
    },
  });
};

export const useGetResume = (id: string | string[] | undefined) => {
  return useQuery({
    queryKey: ["resumes", id],
    queryFn: async () => {
      const response = await api.get(`/api/resumes/${id}`);
      return response.data.resume;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
