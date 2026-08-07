import type { CompanySettings, UserProfile } from "@/types/settings";

export const MOCK_COMPANY_SETTINGS: CompanySettings = {
  name: "KZN eSports",
  email: "contato@kzn-esports.com",
  phone: "+55 (11) 99999-9999",
};

export const MOCK_USER_PROFILE: UserProfile = {
  id: "usr_01",
  name: "Kevin Admin",
  email: "admin@kzn.com",
  role: "OWNER",
};

export const MOCK_SETTINGS_DELAY = 400;
