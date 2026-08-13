import { useState, useEffect } from "react";
import type { Platform } from "@/types/platformType";
import { platformService } from "@/service/platformService";

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchPlatforms() {
      try {
        const data = await platformService.getPlatforms();
        if (mounted) setPlatforms(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Erro ao carregar plataformas.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchPlatforms();
    return () => { mounted = false; };
  }, []);

  return { platforms, isLoading, error };
}
