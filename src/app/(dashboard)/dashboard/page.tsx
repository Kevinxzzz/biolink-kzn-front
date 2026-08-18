"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardPeriodFilter } from "@/types/analyticsType";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import styles from "./dashboard.module.scss";

// Custom Tooltip for Recharts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any; label?: string }) => {
  if (active && payload && payload.length) {
    const p = payload;
    return (
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
        padding: "0.75rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
      }}>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-primary)" }}>
          Atual: {payload[0].value}
        </p>
        {payload[1] && (
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Anterior: {payload[1].value}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function DashboardOverviewPage() {
  const [period, setPeriod] = useState<DashboardPeriodFilter>("7days");
  const [linkFilter, setLinkFilter] = useState("all");
  const [influencerFilter, setInfluencerFilter] = useState("all");

  const { data, isLoading } = useDashboard(period, linkFilter !== "all" ? linkFilter : undefined, influencerFilter !== "all" ? influencerFilter : undefined);

  if (isLoading || !data) {
    return (
      <DashboardLayout pageTitle="Visão Geral">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Visão Geral">
      <div className={styles.page}>

        {/* Header & Filters */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Analytics</h1>
          <div className={styles.filters}>
            <select className={styles.filterSelect} value={period} onChange={(e) => setPeriod(e.target.value as DashboardPeriodFilter)}>
              <option value="today">Hoje</option>
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="custom">Personalizado</option>
            </select>
            <select className={styles.filterSelect} value={linkFilter} onChange={(e) => setLinkFilter(e.target.value)}>
              <option value="all">Todos os Links</option>
              <option value="lnk_1">Grupo WhatsApp</option>
            </select>
            <select className={styles.filterSelect} value={influencerFilter} onChange={(e) => setInfluencerFilter(e.target.value)}>
              <option value="all">Todos os Influenciadores</option>
              <option value="inf_1">João Silva</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
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

        {/* Chart Section */}
        <div className={styles.chartSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Evolução de Cliques</h2>
            <div className={styles.chartLegend}>
              <span className={`${styles.legendItem} ${styles.legendCurrent}`}>Período Atual</span>
              <span className={`${styles.legendItem} ${styles.legendPrevious}`}>Período Anterior</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                <Line type="monotone" dataKey="currentPeriodClicks" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--bg-elevated)", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="previousPeriodClicks" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className={styles.bottomGrid}>

          {/* Top Links */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Links Mais Acessados</h3>
            <div className={styles.list}>
              {data.topLinks.map(link => (
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

          {/* Top Influencers */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Top Influenciadores</h3>
            <div className={styles.list}>
              {data.topInfluencers.map(inf => (
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

          {/* System Status / Active Link */}
          <div className={`${styles.widget} ${styles.statusWidget}`}>
            <h3 className={styles.widgetTitle}>Status do Sistema</h3>

            <div className={styles.activeLinkCard}>
              <div className={styles.activeHeader}>
                <span className={styles.activeLabel}>Link Ativo</span>
              </div>
              <div className={styles.activeLinkName}>Grupo WhatsApp</div>
              <div className={styles.activeLinkUrl}>https://chat.whatsapp.com/abc</div>
            </div>

            <div className={styles.rotationStatus}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-5.67" />
              </svg>
              <span>Rotação automática: <strong>Ativada</strong></span>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
