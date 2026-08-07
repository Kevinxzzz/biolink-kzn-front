"use client";

import { useState, useEffect, useCallback } from "react";
import type { InvitationToken, CreateInvitationData } from "@/types/invitation";
import * as invitationService from "@/service/invitationService";

export function useInvitations() {
  const [invitations, setInvitations] = useState<InvitationToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await invitationService.listInvitations();
      setInvitations(data);
    } catch {
      setError("Erro ao carregar convites.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const create = async (data: CreateInvitationData): Promise<InvitationToken> => {
    const newInvitation = await invitationService.createInvitation(data);
    setInvitations((prev) => [newInvitation, ...prev]);
    return newInvitation;
  };

  const revoke = async (id: string) => {
    await invitationService.revokeInvitation(id);
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "REVOKED" as const } : inv
      )
    );
  };

  return { invitations, isLoading, error, create, revoke, refresh: fetchInvitations };
}
