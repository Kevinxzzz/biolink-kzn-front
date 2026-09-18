import type { DashboardOverview, ChartDataPoint, TopLink, TopInfluencer, DashboardPeriodFilter } from "@/types/analyticsType";
import { httpClient } from "./httpClient";

export interface DashboardLink {
  id: string;
  title: string;
  url: string;
  active: boolean;
  category: { name: string };
}

export interface DashboardAnalyticsResponse {
  overview: DashboardOverview;
  chartData: ChartDataPoint[];
  topLinks: TopLink[];
  topInfluencers: TopInfluencer[];
  allLinks: DashboardLink[];
  allInfluencers: { id: string; name: string }[];
  influencerEvolution: Record<string, string | number>[];
}

export const dashboardService = {
  async getAnalytics(
    period: DashboardPeriodFilter = "dia",
    linkId?: string,
    influencerId?: string
  ): Promise<DashboardAnalyticsResponse> {
    const params: Record<string, string> = { period };

    if (linkId && linkId !== "all") params.linkId = linkId;
    if (influencerId && influencerId !== "all") params.influencerId = influencerId;

    const response = await httpClient.get<{ data: Record<string, unknown> }>("/dashboard", { params });
    const data = response.data as Record<string, unknown>;

    type RawEvolution = { date: string; clicks: number };
    type RawLink = { id: string; title: string; url: string; clicks: number };
    type RawInfluencer = { id: string; name: string; avatarUrl?: string; clicks: number };

    return {
      overview: {
        totalClicks: (data.status as { totalClicks: number })?.totalClicks || 0,
        totalClicksTrend: 0,
        todayClicks: (data.status as { clicksToday: number })?.clicksToday || 0,
        todayClicksTrend: 0,
      },
      chartData: ((data.evolution as RawEvolution[]) || []).map((e) => ({
        date: e.date,
        currentPeriodClicks: e.clicks,
        previousPeriodClicks: 0,
      })),
      topLinks: ((data.topLinks as RawLink[]) || []).map((l, index) => ({
        id: l.id,
        title: l.title,
        url: l.url || "",
        clicks: l.clicks,
        rank: index + 1,
      })),
      topInfluencers: ((data.topInfluencers as RawInfluencer[]) || []).map((inf, index) => ({
        id: inf.id,
        name: inf.name,
        avatarUrl: inf.avatarUrl,
        clicks: inf.clicks,
        rank: index + 1,
      })),
      allLinks: (data.allLinks as DashboardLink[]) || [],
      allInfluencers: (data.allInfluencers as { id: string; name: string }[]) || [],
      influencerEvolution: (data.influencerEvolution as Record<string, string | number>[]) || [],
    };
  },
};
