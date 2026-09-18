import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/service/categoryService";
import type { UpdateCategoryRotationPayload } from "@/types/categoryType";

export function useGlobalRotation() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["globalRotation"],
    queryFn: () => categoryService.getGlobalRotation(),
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateCategoryRotationPayload) => categoryService.updateGlobalRotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["globalRotation"] });
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
