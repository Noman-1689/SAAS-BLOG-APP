// src/hooks/useTitleMutation.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

/**
 * 1. Hook to fetch a specific Title Set by ID
 */
export const useGetTitleSet = (id: string | string[] | undefined) => {
  return useQuery({
    queryKey: ["titles", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/articles/titles/${id}`);
      return data;
    },
    enabled: !!id, // Prevent query from running if no ID is present
    staleTime: 1000 * 60 * 10, // Keep SEO titles cached for 10 mins
  });
};

/**
 * 2. Hook to generate new SEO titles
 */
export const useGenerateTitles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { category: string; keywords: string }) => {
      const response = await api.post("/api/articles/titles", data);
      return response.data;
    },
    onSuccess: (newSet) => {
      toast.success("SEO titles generated successfully!");
      // 1. Invalidate the dashboard library to show the new set immediately
      queryClient.invalidateQueries({ queryKey: ["userLibrary"] });

      // 2. Invalidate the general titles list if you have one
      queryClient.invalidateQueries({ queryKey: ["titles"] });

      // 3. OPTIONAL: Seed the detail page cache so navigation is instant
      if (newSet?.data?.id) {
        queryClient.setQueryData(["titles", newSet.data.id], newSet);
      }
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Failed to generate titles";
      toast.error(errorMsg);
    },
  });
};
