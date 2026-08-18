import { useState, useEffect, useCallback } from "react";
import { linkService } from "@/service/linkService";
import type { RotationSettings } from "@/types/linkType";

export function useRotationSettings() {
  const [settings, setSettings] = useState<RotationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await linkService.getRotationSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar rotação.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (data: Partial<RotationSettings>) => {
    setIsSaving(true);
    try {
      const updated = await linkService.updateRotationSettings(data);
      setSettings(updated);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erro ao salvar rotação.");
    } finally {
      setIsSaving(false);
    }
  };

  return { settings, isLoading, isSaving, error, updateSettings, refetch: fetchSettings };
}
