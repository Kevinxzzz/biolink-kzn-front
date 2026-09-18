"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardPeriodFilter } from "@/types/analyticsType";
import { DashboardHeader, DashboardCharts, DashboardWidgets } from "@/components/ComponentsPage/dashboardOverviewPage";
import styles from "./dashboard.module.scss";

export default function DashboardOverviewPage() {
  const [period, setPeriod] = useState<DashboardPeriodFilter>("dia");
  const [filterMode, setFilterMode] = useState<"all" | "link" | "influencer">("all");
  const [linkFilter, setLinkFilter] = useState("all");
  const [influencerFilter, setInfluencerFilter] = useState("all");

  const [chartTab, setChartTab] = useState<"evolution" | "influencer">("evolution");
  const [widgetTab, setWidgetTab] = useState<"links" | "influencers" | "status">("links");

  const { data, isLoading } = useDashboard(
    period,
    linkFilter !== "all" ? linkFilter : undefined,
    influencerFilter !== "all" ? influencerFilter : undefined
  );

  if (isLoading || !data) {
    return (
      <DashboardLayout pageTitle="Visão Geral">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </DashboardLayout>
    );
  }

  const activeLinks = data.allLinks.filter((l) => l.active);

  return (
    <DashboardLayout pageTitle="Visão Geral">
      <div className={styles.page}>
        <DashboardHeader
          period={period}
          setPeriod={setPeriod}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          linkFilter={linkFilter}
          setLinkFilter={setLinkFilter}
          influencerFilter={influencerFilter}
          setInfluencerFilter={setInfluencerFilter}
          setChartTab={setChartTab}
          allLinks={data.allLinks}
          allInfluencers={data.allInfluencers}
        />

        <div className={styles.statsGrid}>
          <StatCard
            title="Total de Cliques"
            value={data.overview.totalClicks.toLocaleString()}
            trend={data.overview.totalClicksTrend}
            trendLabel="vs. período anterior"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            }
          />
          <StatCard
            title="Cliques Hoje"
            value={data.overview.todayClicks.toLocaleString()}
            trend={data.overview.todayClicksTrend}
            trendLabel="vs. ontem"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>

        <DashboardCharts
          chartTab={chartTab}
          setChartTab={setChartTab}
          chartData={data.chartData}
          influencerEvolution={data.influencerEvolution}
          allInfluencers={data.allInfluencers}
        />

        <DashboardWidgets
          widgetTab={widgetTab}
          setWidgetTab={setWidgetTab}
          activeLinks={activeLinks}
          topLinks={data.topLinks}
          topInfluencers={data.topInfluencers}
        />
      </div>
    </DashboardLayout>
  );
}
