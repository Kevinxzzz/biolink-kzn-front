import { useMutation, useQueryClient } from "@tanstack/react-query";
import { influencerService, CreateInfluencerData, UpdateInfluencerData } from "@/service/influencerService";

export function useCreateInfluencer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateInfluencerData) => influencerService.createInfluencer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    },
  });

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useUpdateInfluencer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInfluencerData }) =>
      influencerService.updateInfluencer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    },
  });

  return {
    update: (id: string, data: UpdateInfluencerData) =>
      mutation.mutateAsync({ id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useDeleteInfluencer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => influencerService.deleteInfluencer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
