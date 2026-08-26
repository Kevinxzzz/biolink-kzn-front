import type { InvitationToken, CreateInvitationData } from "@/types/invitationType";
import { MOCK_INVITATIONS, MOCK_INVITATION_DELAY } from "./mocks/invitationMocks";

export async function listInvitations(): Promise<InvitationToken[]> {
  // TODO: Substituir por chamada real à API
  await new Promise((resolve) => setTimeout(resolve, MOCK_INVITATION_DELAY));
  return MOCK_INVITATIONS;
}

export async function createInvitation(data: CreateInvitationData): Promise<InvitationToken> {
  // TODO: Substituir por chamada real à API
  await new Promise((resolve) => setTimeout(resolve, MOCK_INVITATION_DELAY));

  const token = `KZN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return {
    id: `inv_${Date.now()}`,
    token,
    accountType: data.accountType,
    status: "VALID",
    createdAt: new Date().toISOString(),
  };
}

export async function revokeInvitation(id: string): Promise<void> {
  // TODO: Substituir por chamada real à API
  await new Promise((resolve) => setTimeout(resolve, MOCK_INVITATION_DELAY));

  const found = MOCK_INVITATIONS.find((inv) => inv.id === id);
  if (!found) {
    throw new Error("Token não encontrado.");
  }
}
