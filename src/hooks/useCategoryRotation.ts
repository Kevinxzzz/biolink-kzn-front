import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/service/categoryService";
import type { UpdateCategoryRotationPayload } from "@/types/categoryType";

export function useCategoryRotation(categoryId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["categoryRotation", categoryId],
    queryFn: () => categoryService.getCategoryRotation(categoryId!),
    enabled: !!categoryId,
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateCategoryRotationPayload) => categoryService.updateCategoryRotation(categoryId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryRotation", categoryId] });
    },
  });

  return {
    rotation: query.data,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    error: query.error || mutation.error,
    updateRotation: mutation.mutateAsync,
  };
}
