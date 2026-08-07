import { useState, useEffect, useCallback } from "react";
import { influencerService } from "@/service/influencerService";
import type { Influencer } from "@/types/influencer";

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfluencers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await influencerService.getInfluencers();
      setInfluencers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar influenciadores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  return { influencers, isLoading, error, refetch: fetchInfluencers };
}
