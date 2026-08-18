import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkService } from "@/service/linkService";
import type { Link } from "@/types/linkType";

export function useCreateLink() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { title: string; url: string }) => linkService.createLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Link, "id" | "countClicks" | "order" | "active">> }) =>
      linkService.updateLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    update: (id: string, data: Partial<Omit<Link, "id" | "countClicks" | "order" | "active">>) =>
      mutation.mutateAsync({ id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => linkService.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useActivateLink() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => linkService.activateLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    activate: mutation.mutateAsync,
    isActivating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useReorderLinks() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newOrderIds: string[]) => linkService.reorderLinks(newOrderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    reorder: mutation.mutateAsync,
    isReordering: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
