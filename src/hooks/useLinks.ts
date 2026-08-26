import { useQuery } from "@tanstack/react-query";
import { linkService } from "@/service/linkService";

export function useLinks() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["links"],
    queryFn: linkService.getLinks,
    refetchOnMount: true,
  });

  return {
    links: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
