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

export function usePublicInfluencer(slug?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publicInfluencer", slug],
    queryFn: () => influencerService.getPublicInfluencerBySlug(slug!),
    enabled: !!slug,
    refetchOnMount: "always",
    retry: false
  });

  return {
    influencer: data,
    isLoading,
    error,
    refetch
  };
}
