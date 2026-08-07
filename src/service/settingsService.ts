import type { CompanySettings, UserProfile } from "@/types/settings";
import { MOCK_COMPANY_SETTINGS, MOCK_USER_PROFILE, MOCK_SETTINGS_DELAY } from "./mocks/settingsMocks";

let companyDb = { ...MOCK_COMPANY_SETTINGS };
const profileDb = { ...MOCK_USER_PROFILE };

const delay = () => new Promise((res) => setTimeout(res, MOCK_SETTINGS_DELAY));

export const settingsService = {
  async getCompanySettings(): Promise<CompanySettings> {
    await delay();
    return { ...companyDb };
  },

  async updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
    await delay();
    companyDb = { ...companyDb, ...data };
    return { ...companyDb };
  },

  async getUserProfile(): Promise<UserProfile> {
    await delay();
    // In a real app, this would get the profile from /me
    return { ...profileDb };
  },
};
