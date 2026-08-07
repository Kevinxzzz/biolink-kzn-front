import type { CompanyRegisterData, InviteRegisterData } from "@/types/register";
import type { InvitationTokenValidation } from "@/types/invitation";
import { MOCK_REGISTER_DELAY } from "./mocks/registerMocks";
import { MOCK_VALID_TOKEN_RESPONSE, MOCK_INVITATION_DELAY } from "./mocks/invitationMocks";

export async function registerCompany(data: CompanyRegisterData): Promise<void> {
  // TODO: Substituir por chamada real à API
  // return fetch("/api/register/company", { method: "POST", body: JSON.stringify(data) })
  await new Promise((resolve) => setTimeout(resolve, MOCK_REGISTER_DELAY));

  if (data.company.email === "existente@kzn.com") {
    throw new Error("Este email de empresa já está cadastrado.");
  }
}

export async function registerWithInvite(data: InviteRegisterData): Promise<void> {
  // TODO: Substituir por chamada real à API
  await new Promise((resolve) => setTimeout(resolve, MOCK_REGISTER_DELAY));

  if (data.email === "existente@kzn.com") {
    throw new Error("Este email já está cadastrado.");
  }
}

export async function validateToken(token: string): Promise<InvitationTokenValidation> {
  // TODO: Substituir por chamada real à API
  await new Promise((resolve) => setTimeout(resolve, MOCK_INVITATION_DELAY));

  if (token === "expired") {
    return { status: "EXPIRED" };
  }
  if (token === "used") {
    return { status: "USED" };
  }
  if (token === "revoked") {
    return { status: "REVOKED" };
  }
  if (token.length < 3) {
    return { status: "INVALID" };
  }

  return MOCK_VALID_TOKEN_RESPONSE;
}
