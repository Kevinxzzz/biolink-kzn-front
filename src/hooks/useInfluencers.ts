import { useQuery } from "@tanstack/react-query";
import { influencerService } from "@/service/influencerService";

export function useInfluencers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["influencers"],
    queryFn: influencerService.getInfluencers,
    refetchOnMount: true,
  });

  return { 
    influencers: data || [], 
    isLoading, 
    error: error instanceof Error ? error.message : null, 
    refetch 
  };
}
