import { useState } from "react";
import { influencerService } from "@/service/influencerService";
import type { InfluencerPlatform } from "@/types/influencerType";

export function useCreateInfluencer() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: { name: string; email: string; avatarUrl?: string; password?: string; platforms: InfluencerPlatform[] }) => {
    setIsCreating(true);
    setError(null);
    try {
      return await influencerService.createInfluencer(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar influenciador.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  return { create, isCreating, error };
}

export function useUpdateInfluencer() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: "ACTIVE" | "INACTIVE") => {
    setIsUpdating(true);
    setError(null);
    try {
      return await influencerService.updateInfluencerStatus(id, status);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar status.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePlatforms = async (id: string, platforms: InfluencerPlatform[]) => {
    setIsUpdating(true);
    setError(null);
    try {
      return await influencerService.updatePlatforms(id, platforms);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar plataformas.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, updatePlatforms, isUpdating, error };
}
