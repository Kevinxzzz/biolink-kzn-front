import { useState, useEffect, useCallback } from "react";
import { dashboardService, type DashboardAnalyticsResponse } from "@/service/dashboardService";
import type { DashboardPeriodFilter } from "@/types/analytics";

export function useDashboard(
  period: DashboardPeriodFilter,
  linkId?: string,
  influencerId?: string
) {
  const [data, setData] = useState<DashboardAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getAnalytics(period, linkId, influencerId);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados do dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [period, linkId, influencerId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, isLoading, error, refetch: fetchAnalytics };
}
