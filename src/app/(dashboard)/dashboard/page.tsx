"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardPeriodFilter } from "@/types/analyticsType";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import styles from "./dashboard.module.scss";

interface TooltipPayloadItem {
  value: number;
  name?: string;
  color?: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

// Custom Tooltip for Recharts with strict typing
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent-primary)" }}>
          Atual: {payload[0].value}
        </p>
        {payload[1] && (
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            Anterior: {payload[1].value}
          </p>
        )}
      </div>
    );
  }
  return null;
};

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
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Análises</h1>
          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={period}
              onChange={(e) => setPeriod(e.target.value as DashboardPeriodFilter)}
            >
              <option value="dia">Hoje</option>
              <option value="mes">Este Mês</option>
              <option value="ano">Este Ano</option>
            </select>
            <select
              className={styles.filterSelect}
              value={filterMode}
              onChange={(e) => {
                const mode = e.target.value as "all" | "link" | "influencer";
                setFilterMode(mode);
                setLinkFilter("all");
                setInfluencerFilter("all");
                if (mode === "influencer") {
                  setChartTab("influencer");
                }
              }}
            >
              <option value="all">Visão Geral</option>
              <option value="link">Filtrar por Link</option>
              <option value="influencer">Filtrar por Influenciador</option>
            </select>

            {filterMode === "link" && (
              <select
                className={styles.filterSelect}
                value={linkFilter}
                onChange={(e) => setLinkFilter(e.target.value)}
              >
                <option value="all">Selecione um Link</option>
                {Object.entries(
                  data.allLinks.reduce<Record<string, typeof data.allLinks>>((acc, l) => {
                    const cat = l.category.name;
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(l);
                    return acc;
                  }, {})
                ).map(([category, links]) => (
                  <optgroup key={category} label={category}>
                    {links.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}

            {filterMode === "influencer" && (
              <select
                className={styles.filterSelect}
                value={influencerFilter}
                onChange={(e) => setInfluencerFilter(e.target.value)}
              >
                <option value="all">Selecione um Influenciador</option>
                {data.allInfluencers.map((inf) => (
                  <option key={inf.id} value={inf.id}>
                    {inf.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

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

        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleGroup}>
              <h2 className={styles.sectionTitle}>
                {chartTab === "evolution" ? "Evolução de Cliques" : "Desempenho por Influenciador"}
              </h2>
              {chartTab === "evolution" ? (
                <div className={styles.chartLegend}>
                  <span className={`${styles.legendItem} ${styles.legendCurrent}`}>Atual</span>
                  <span className={`${styles.legendItem} ${styles.legendPrevious}`}>Anterior</span>
                </div>
              ) : (
                <span className={styles.chartSubtitle}>Comparativo por perfil</span>
              )}
            </div>

            <div className={styles.segmentedControl} role="tablist">
              <button
                type="button"
                className={`${styles.segmentButton} ${chartTab === "evolution" ? styles.activeSegment : ""}`}
                onClick={() => setChartTab("evolution")}
                role="tab"
                aria-selected={chartTab === "evolution"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Geral</span>
              </button>
              <button
                type="button"
                className={`${styles.segmentButton} ${chartTab === "influencer" ? styles.activeSegment : ""}`}
                onClick={() => setChartTab("influencer")}
                role="tab"
                aria-selected={chartTab === "influencer"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Influenciadores</span>
              </button>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              {chartTab === "evolution" ? (
                <LineChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                  <Line type="monotone" dataKey="currentPeriodClicks" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--bg-elevated)", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="previousPeriodClicks" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
                </LineChart>
              ) : (
                <LineChart data={data.influencerEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }} contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }} />
                  {data.allInfluencers.map((inf, i) => (
                    <Line key={inf.id} type="monotone" dataKey={inf.name} stroke={`hsl(${(i * 137.5) % 360}, 70%, 50%)`} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mobile-only Segmented Controller for Bottom Widgets */}
        <div className={styles.widgetSegmentedControl} role="tablist">
          <button
            type="button"
            className={`${styles.segmentButton} ${widgetTab === "links" ? styles.activeSegment : ""}`}
            onClick={() => setWidgetTab("links")}
            role="tab"
            aria-selected={widgetTab === "links"}
          >
            <span>Top Links</span>
          </button>
          <button
            type="button"
            className={`${styles.segmentButton} ${widgetTab === "influencers" ? styles.activeSegment : ""}`}
            onClick={() => setWidgetTab("influencers")}
            role="tab"
            aria-selected={widgetTab === "influencers"}
          >
            <span>Top Influenciadores</span>
          </button>
          <button
            type="button"
            className={`${styles.segmentButton} ${widgetTab === "status" ? styles.activeSegment : ""}`}
            onClick={() => setWidgetTab("status")}
            role="tab"
            aria-selected={widgetTab === "status"}
          >
            <span>Ativos ({activeLinks.length})</span>
          </button>
        </div>

        <div className={styles.bottomGrid}>
          <div className={`${styles.widget} ${widgetTab !== "links" ? styles.tabHiddenOnMobile : ""}`}>
            <h3 className={styles.widgetTitle}>Links Mais Acessados</h3>
            <div className={styles.list}>
              {data.topLinks.map((link) => (
                <div key={link.id} className={styles.listItem}>
                  <div className={`${styles.rankBadge} ${link.rank <= 3 ? styles.rankTop : ""}`}>
                    {link.rank.toString().padStart(2, "0")}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{link.title}</div>
                    <div className={styles.itemSub}>{link.url}</div>
                  </div>
                  <div className={styles.itemValue}>{link.clicks.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.widget} ${widgetTab !== "influencers" ? styles.tabHiddenOnMobile : ""}`}>
            <h3 className={styles.widgetTitle}>Top Influenciadores</h3>
            <div className={styles.list}>
              {data.topInfluencers.map((inf) => (
                <div key={inf.id} className={styles.listItem}>
                  <div className={styles.avatar}>
                    {inf.avatarUrl ? <img src={inf.avatarUrl} alt={inf.name} /> : inf.name.charAt(0)}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{inf.name}</div>
                  </div>
                  <div className={styles.itemValue}>{inf.clicks.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.widget} ${styles.statusWidget} ${widgetTab !== "status" ? styles.tabHiddenOnMobile : ""}`}>
            <h3 className={styles.widgetTitle}>Status do Sistema ({activeLinks.length} Links Ativos)</h3>
            <div className={styles.activeLinksGrid}>
              {activeLinks.map((link) => (
                <div key={link.id} className={styles.activeLinkCard}>
                  <div className={styles.activeHeader}>
                    <span className={styles.activeLabel}>Ativo</span>
                    {link.category?.name && (
                      <span className={styles.activeCategory}>{link.category.name}</span>
                    )}
                  </div>
                  <div className={styles.activeLinkName}>{link.title}</div>
                  <div className={styles.activeLinkUrl}>{link.url}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
