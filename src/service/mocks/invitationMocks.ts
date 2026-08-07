import type { InvitationToken, InvitationTokenValidation } from "@/types/invitation";

export const MOCK_VALID_TOKEN_RESPONSE: InvitationTokenValidation = {
  status: "VALID",
  enterpriseName: "KZN eSports",
  accountType: "ADMIN",
};

export const MOCK_INVITATIONS: InvitationToken[] = [
  {
    id: "inv_02",
    token: "KZN-E5F6G7H8",
    accountType: "ADMIN",
    status: "USED",
    createdAt: "2026-07-28T14:30:00Z",
    usedAt: "2026-07-30T09:15:00Z",
  },
  {
    id: "inv_04",
    token: "KZN-M3N4O5P6",
    accountType: "ADMIN",
    status: "REVOKED",
    createdAt: "2026-07-20T16:00:00Z",
  },
];

export const MOCK_INVITATION_DELAY = 800;
