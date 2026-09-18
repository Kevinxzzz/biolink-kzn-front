export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthenticatedUser {
  email: string;
  name: string;
  role?: UserRole;
  enterprise?: {
    name: string;
    email: string;
    phoneNumber: string;
  } | null;
  application?: {
    domain: string;
  } | null;
}

export type UserRole = "OWNER" | "ADMIN";
