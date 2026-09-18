export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  enterpriseId?: string; // Optional if not always present
  accountType: "USER" | "INFLUENCER";
  role?: UserRole;
  enterprise?: {
    name: string;
    email: string;
    phoneNumber: string;
  } | null;
  application?: {
    name: string;
    domain: string;
  } | null;
}

export type UserRole = "OWNER" | "ADMIN";
