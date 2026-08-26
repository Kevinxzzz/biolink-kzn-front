import { UserRole } from "./authType";

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
