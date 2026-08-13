import type { ChartDataPoint, DashboardOverview, TopLink, TopInfluencer } from "@/types/analyticsType";

export const MOCK_OVERVIEW: DashboardOverview = {
  totalClicks: 24582,
  totalClicksTrend: 18.4,
  todayClicks: 1240,
  todayClicksTrend: -2.1,
};

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: "01/08", currentPeriodClicks: 1200, previousPeriodClicks: 1000 },
  { date: "02/08", currentPeriodClicks: 1400, previousPeriodClicks: 1100 },
  { date: "03/08", currentPeriodClicks: 1100, previousPeriodClicks: 1150 },
  { date: "04/08", currentPeriodClicks: 1800, previousPeriodClicks: 1050 },
  { date: "05/08", currentPeriodClicks: 2200, previousPeriodClicks: 1300 },
  { date: "06/08", currentPeriodClicks: 1900, previousPeriodClicks: 1250 },
  { date: "07/08", currentPeriodClicks: 2400, previousPeriodClicks: 1400 },
];

export const MOCK_TOP_LINKS: TopLink[] = [
  { id: "lnk_1", title: "Grupo WhatsApp", url: "https://chat.whatsapp.com/abc", clicks: 8421, rank: 1 },
  { id: "lnk_2", title: "Comprar conta", url: "https://kzn.com/buy", clicks: 6832, rank: 2 },
  { id: "lnk_3", title: "Instagram", url: "https://instagram.com/kzn", clicks: 4221, rank: 3 },
  { id: "lnk_4", title: "Discord Oficial", url: "https://discord.gg/kzn", clicks: 1250, rank: 4 },
];

export const MOCK_TOP_INFLUENCERS: TopInfluencer[] = [
  { id: "inf_1", name: "João Silva", clicks: 5421, rank: 1 },
  { id: "inf_2", name: "Maria Lima", clicks: 3892, rank: 2 },
  { id: "inf_3", name: "Pedro E-sports", clicks: 2104, rank: 3 },
];

export const MOCK_DASHBOARD_DELAY = 600;
