import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateInvitationData } from "@/types/invitationType";
import * as invitationService from "@/service/invitationService";

export function useInvitations() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invitations"],
    queryFn: invitationService.listInvitations,
  });

  return { 
    invitations: data || [], 
    isLoading, 
    error: error instanceof Error ? error.message : null, 
    refresh: refetch 
  };
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateInvitationData) => invitationService.createInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => invitationService.revokeInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  return {
    revoke: mutation.mutateAsync,
    isRevoking: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
