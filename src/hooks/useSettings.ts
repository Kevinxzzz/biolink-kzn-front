import { useState, useEffect, useCallback } from "react";
import { settingsService } from "@/service/settingsService";
import type { CompanySettings, UserProfile } from "@/types/settings";

export function useSettings() {
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [company, profile] = await Promise.all([
        settingsService.getCompanySettings(),
        settingsService.getUserProfile(),
      ]);
      setCompanySettings(company);
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar configurações.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateCompany = async (data: Partial<CompanySettings>) => {
    setIsSaving(true);
    try {
      const updated = await settingsService.updateCompanySettings(data);
      setCompanySettings(updated);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  return { companySettings, userProfile, isLoading, isSaving, error, updateCompany, refetch: fetchSettings };
}
