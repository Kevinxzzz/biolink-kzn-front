import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardAnalyticsResponse } from "@/service/dashboardService";
import type { DashboardPeriodFilter } from "@/types/analyticsType";

export function useDashboard(
  period: DashboardPeriodFilter,
  linkId?: string,
  influencerId?: string
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", period, linkId, influencerId],
    queryFn: () => dashboardService.getAnalytics(period, linkId, influencerId),
    refetchOnMount: "always",
  });

  return { 
    data, 
    isLoading, 
    error: error instanceof Error ? error.message : null, 
    refetch 
  };
}
