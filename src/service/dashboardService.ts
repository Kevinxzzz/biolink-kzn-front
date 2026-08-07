import type { DashboardOverview, ChartDataPoint, TopLink, TopInfluencer, DashboardPeriodFilter } from "@/types/analytics";
import { MOCK_OVERVIEW, MOCK_CHART_DATA, MOCK_TOP_LINKS, MOCK_TOP_INFLUENCERS, MOCK_DASHBOARD_DELAY } from "./mocks/dashboardMocks";

export interface DashboardAnalyticsResponse {
  overview: DashboardOverview;
  chartData: ChartDataPoint[];
  topLinks: TopLink[];
  topInfluencers: TopInfluencer[];
}

export const dashboardService = {
  async getAnalytics(
    period: DashboardPeriodFilter = "7days",
    linkId?: string,
    influencerId?: string
  ): Promise<DashboardAnalyticsResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Here we could manipulate mock data based on filters to simulate API behavior,
        // but for now returning the static mock is fine to build the UI.
        resolve({
          overview: MOCK_OVERVIEW,
          chartData: MOCK_CHART_DATA,
          topLinks: MOCK_TOP_LINKS,
          topInfluencers: MOCK_TOP_INFLUENCERS,
        });
      }, MOCK_DASHBOARD_DELAY);
    });
  },
};
