import { UserRole } from "./auth";

export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
