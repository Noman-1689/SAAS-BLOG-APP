// src/hooks/useArticleMutation.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

// 1. Hook for fetching a single article by ID
export const useGetArticle = (id: string | string[] | undefined) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: async () => {
      const response = await api.get(`/api/articles/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run if ID is truthy
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// 2. Hook for generating a new article
export const useGenerateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { topic: string; wordCount: number }) => {
      const response = await api.post("/api/articles", data);
      return response.data;
    },
    onSuccess: (newArticle) => {
      toast.success("Article generated successfully!");
      // Invalidate the list so the dashboard/sidebar updates
      queryClient.invalidateQueries({ queryKey: ["articles"] });

      // OPTIONAL: Pre-set the cache for the detail page so it loads instantly
      if (newArticle?.data?.id) {
        queryClient.setQueryData(["articles", newArticle.data.id], newArticle);
      }
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Failed to generate article";
      toast.error(errorMsg);
    },
  });
};
