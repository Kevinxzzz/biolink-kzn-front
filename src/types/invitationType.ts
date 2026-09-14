export type InvitationTokenStatus =
  | "VALID"
  | "INVALID"
  | "EXPIRED"
  | "USED"
  | "REVOKED";

export type InvitationAccountType = "ADMIN";

export interface InvitationTokenValidation {
  status: InvitationTokenStatus;
  enterpriseName?: string;
  accountType?: InvitationAccountType;
}

export interface InvitationToken {
  id: string;
  token: string;
  accountType: InvitationAccountType;
  status: InvitationTokenStatus;
  createdAt: string;
  maxUses: number;
  uses: number;
  usedAt?: string;
  expiresAt?: string;
}

export interface CreateInvitationData {
  expiresInHours: number;
  maxUses: number;
}
