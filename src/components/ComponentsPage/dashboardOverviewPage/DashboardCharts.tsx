"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import styles from "@/app/(dashboard)/dashboard/dashboard.module.scss";

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
}

interface DashboardChartsProps {
  chartTab: "evolution" | "influencer";
  setChartTab: (tab: "evolution" | "influencer") => void;
  chartData: any[];
  influencerEvolution: any[];
  allInfluencers: any[];
}

export function DashboardCharts({
  chartTab,
  setChartTab,
  chartData,
  influencerEvolution,
  allInfluencers,
}: DashboardChartsProps) {
  return (
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
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }} />
              <Line type="monotone" dataKey="currentPeriodClicks" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--bg-elevated)", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="previousPeriodClicks" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
            </LineChart>
          ) : (
            <LineChart data={influencerEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }} contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "8px" }} />
              {allInfluencers.map((inf, i) => (
                <Line key={inf.id} type="monotone" dataKey={inf.name} stroke={`hsl(${(i * 137.5) % 360}, 70%, 50%)`} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
