import type { CompanyRegisterData, InviteRegisterData } from "@/types/enterpriseType";
import type { InvitationTokenValidation } from "@/types/invitationType";
import { httpClient, getErrorMessage, ApiError } from "./httpClient";

export async function registerCompany(data: CompanyRegisterData): Promise<void> {
  try {
    await httpClient.post("/auth/register/enterprise", data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function registerWithInvite(data: InviteRegisterData): Promise<void> {
  try {
    const { token, ...userData } = data;
    await httpClient.post(`/token-invites/invite/${token}/register`, userData);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function validateToken(token: string): Promise<InvitationTokenValidation> {
  try {
    const response = await httpClient.get(`/token-invites/invite/${token}/validate`);
    
    // O backend retorna algo como { valid: true, enterpriseName: "...", ... }
    return { 
      status: "VALID",
      enterpriseName: response.data.enterpriseName,
      accountType: "ADMIN" // Fixado conforme arquitetura
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
       const msg = error.message.toLowerCase();
       if (msg.includes("expirou") || msg.includes("não é mais válido")) {
         return { status: "EXPIRED" };
       }
       if (msg.includes("limite") || msg.includes("máximo de usos")) {
         return { status: "USED" };
       }
       if (error.statusCode === 404 || msg.includes("não encontrado")) {
         return { status: "INVALID" };
       }
    }
    
    throw error;
  }
}
