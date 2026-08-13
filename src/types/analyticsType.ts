export interface ChartDataPoint {
  date: string;
  currentPeriodClicks: number;
  previousPeriodClicks: number;
}

export interface DashboardOverview {
  totalClicks: number;
  totalClicksTrend: number;
  todayClicks: number;
  todayClicksTrend: number;
}

export interface TopLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
  rank: number;
}

export interface TopInfluencer {
  id: string;
  name: string;
  avatarUrl?: string;
  clicks: number;
  rank: number;
}

export type DashboardPeriodFilter = "today" | "7days" | "30days" | "custom";
