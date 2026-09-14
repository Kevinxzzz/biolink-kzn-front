import type { InvitationToken, CreateInvitationData } from "@/types/invitationType";
import { httpClient, getErrorMessage } from "./httpClient";

export async function listInvitations(): Promise<InvitationToken[]> {
  try {
    const response = await httpClient.get("/token-invites");
    
    return response.data.map((inv: { id: string; token: string; status: string; createdAt: string; uses: number; maxUses: number; expiresAt: string }) => ({
      id: inv.id,
      token: inv.token,
      accountType: "ADMIN",
      status: inv.status === "ATIVO" ? "VALID" : inv.status === "ESGOTADO" ? "USED" : "EXPIRED",
      createdAt: inv.createdAt,
      maxUses: inv.maxUses,
      uses: inv.uses,
      usedAt: inv.uses > 0 ? new Date().toISOString() : undefined,
      expiresAt: inv.expiresAt
    }));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createInvitation(data: CreateInvitationData): Promise<InvitationToken> {
  try {
    const response = await httpClient.post("/token-invites", data);
    const tokenData = response.data.data;
    return {
      id: tokenData.id,
      token: tokenData.token,
      accountType: "ADMIN",
      status: "VALID",
      createdAt: new Date().toISOString(),
      maxUses: data.maxUses,
      uses: 0
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function revokeInvitation(id: string): Promise<void> {
  try {
    await httpClient.delete(`/token-invites/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
