import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/service/categoryService";

export function useCategories() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    refetchOnMount: true,
  });

  return {
    categories: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function usePublicCategories() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["public-categories"],
    queryFn: categoryService.getPublicCategories,
    refetchOnMount: true,
  });

  return {
    categories: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
