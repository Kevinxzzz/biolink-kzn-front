export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  enterpriseId: string;
  accountType: "USER" | "INFLUENCER";
  role?: UserRole;
}

export type UserRole = "OWNER" | "ADMIN";
