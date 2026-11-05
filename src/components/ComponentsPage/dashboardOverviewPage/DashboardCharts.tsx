"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { DashboardPeriodFilter } from "@/types/analyticsType";
import styles from "@/app/(dashboard)/dashboard/dashboard.module.scss";

const MONTHS_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const MONTHS_FULL = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

interface ParsedDateInfo {
  primaryTick: string;
  secondaryTick?: string;
  tooltipTitle: string;
  tooltipSubtitle?: string;
  compactRangeLabel: string;
}

function parseChartDate(raw: string, period?: DashboardPeriodFilter): ParsedDateInfo {
  if (!raw) {
    return {
      primaryTick: "—",
      tooltipTitle: "Data indisponível",
      compactRangeLabel: "—",
    };
  }

  const trimmed = String(raw).trim();

  // Case 1: Pure time like "14:00", "09:30", or "14h"
  const timeOnlyMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeOnlyMatch) {
    const [, hh, mm] = timeOnlyMatch;
    const hour = hh.padStart(2, "0");
    return {
      primaryTick: mm === "00" ? `${hour}h` : `${hour}:${mm}`,
      secondaryTick: Number(hour) < 12 ? "manhã" : Number(hour) < 18 ? "tarde" : "noite",
      tooltipTitle: `Hoje às ${hour}:${mm}`,
      tooltipSubtitle: "Horário registrado",
      compactRangeLabel: `${hour}:${mm}`,
    };
  }

  // Case 2: Year-Month like "2026-11" or "11/2026"
  const ymIsoMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  const ymBrMatch = trimmed.match(/^(\d{2})\/(\d{4})$/);
  if (ymIsoMatch || ymBrMatch) {
    const year = Number(ymIsoMatch ? ymIsoMatch[1] : ymBrMatch![2]);
    const monthIdx = Number(ymIsoMatch ? ymIsoMatch[2] : ymBrMatch![1]) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return {
        primaryTick: MONTHS_SHORT[monthIdx],
        secondaryTick: String(year).slice(-2),
        tooltipTitle: `${MONTHS_FULL[monthIdx]} de ${year}`,
        tooltipSubtitle: "Consolidado mensal",
        compactRangeLabel: `${MONTHS_SHORT[monthIdx]} ${year}`,
      };
    }
  }

  // Case 3: YYYY-MM-DD (with optional time "2026-11-05T14:00..." or "2026-11-05 14:00")
  const ymdMatch = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/
  );
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const monthIdx = Number(ymdMatch[2]) - 1;
    const day = Number(ymdMatch[3]);
    const hh = ymdMatch[4];
    const mm = ymdMatch[5];

    const dateObj = new Date(year, monthIdx, day);
    const weekdayIdx = dateObj.getDay();
    const dayStr = String(day).padStart(2, "0");
    const monthShort = MONTHS_SHORT[monthIdx] || "";
    const monthFull = MONTHS_FULL[monthIdx] || "";

    if (period === "ano") {
      return {
        primaryTick: monthShort,
        secondaryTick: String(year),
        tooltipTitle: `${monthFull} de ${year}`,
        tooltipSubtitle: `Dia ${dayStr} • ${WEEKDAYS_FULL[weekdayIdx]}`,
        compactRangeLabel: `${monthShort} ${year}`,
      };
    }

    if (hh && mm && period === "dia") {
      return {
        primaryTick: `${hh}h`,
        secondaryTick: `${dayStr}/${String(monthIdx + 1).padStart(2, "0")}`,
        tooltipTitle: `${dayStr} de ${monthFull} às ${hh}:${mm}`,
        tooltipSubtitle: WEEKDAYS_FULL[weekdayIdx],
        compactRangeLabel: `${dayStr} ${monthShort}, ${hh}:${mm}`,
      };
    }

    return {
      primaryTick: dayStr,
      secondaryTick: monthShort.toUpperCase(),
      tooltipTitle: `${dayStr} de ${monthFull}, ${year}`,
      tooltipSubtitle: WEEKDAYS_FULL[weekdayIdx],
      compactRangeLabel: `${dayStr} ${monthShort}`,
    };
  }

  // Case 4: DD/MM/YYYY or DD/MM
  const dmyMatch = trimmed.match(/^(\d{2})\/(\d{2})(?:\/(\d{2,4}))?$/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const monthIdx = Number(dmyMatch[2]) - 1;
    const rawYear = dmyMatch[3];
    const year = rawYear
      ? rawYear.length === 2
        ? 2000 + Number(rawYear)
        : Number(rawYear)
      : new Date().getFullYear();

    const dateObj = new Date(year, monthIdx, day);
    const weekdayIdx = dateObj.getDay();
    const dayStr = String(day).padStart(2, "0");
    const monthShort = MONTHS_SHORT[monthIdx] || "";
    const monthFull = MONTHS_FULL[monthIdx] || "";

    return {
      primaryTick: dayStr,
      secondaryTick: monthShort.toUpperCase(),
      tooltipTitle: `${dayStr} de ${monthFull}, ${year}`,
      tooltipSubtitle: WEEKDAYS_FULL[weekdayIdx],
      compactRangeLabel: `${dayStr} ${monthShort}`,
    };
  }

  // Fallback for any other string (e.g. "Seg", "Jan", etc.)
  const fallbackDate = new Date(trimmed);
  if (!Number.isNaN(fallbackDate.getTime())) {
    const day = fallbackDate.getDate();
    const monthIdx = fallbackDate.getMonth();
    const year = fallbackDate.getFullYear();
    const weekdayIdx = fallbackDate.getDay();
    const dayStr = String(day).padStart(2, "0");

    return {
      primaryTick: `${dayStr} ${MONTHS_SHORT[monthIdx]}`,
      secondaryTick: WEEKDAYS_SHORT[weekdayIdx],
      tooltipTitle: `${dayStr} de ${MONTHS_FULL[monthIdx]}, ${year}`,
      tooltipSubtitle: WEEKDAYS_FULL[weekdayIdx],
      compactRangeLabel: `${dayStr} ${MONTHS_SHORT[monthIdx]}`,
    };
  }

  return {
    primaryTick: trimmed,
    tooltipTitle: trimmed,
    compactRangeLabel: trimmed,
  };
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  period?: DashboardPeriodFilter;
}

const CustomXAxisTick = ({ x = 0, y = 0, payload, period }: CustomXAxisTickProps) => {
  if (!payload?.value) return null;
  const { primaryTick, secondaryTick } = parseChartDate(payload.value, period);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={12}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize={11}
        fontWeight={600}
      >
        {primaryTick}
      </text>
      {secondaryTick && (
        <text
          x={0}
          y={25}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={9.5}
          fontWeight={500}
          letterSpacing="0.04em"
        >
          {secondaryTick}
        </text>
      )}
    </g>
  );
};

interface TooltipPayloadItem {
  value: number;
  name?: string;
  color?: string;
  stroke?: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  period?: DashboardPeriodFilter;
  chartTab?: "evolution" | "influencer";
}

const CustomTooltip = ({
  active,
  payload,
  label,
  period,
  chartTab = "evolution",
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const dateInfo = parseChartDate(label || "", period);

  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipHeader}>
        <div className={styles.tooltipDateIcon}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className={styles.tooltipDateTexts}>
          <span className={styles.tooltipDateTitle}>{dateInfo.tooltipTitle}</span>
          {dateInfo.tooltipSubtitle && (
            <span className={styles.tooltipDateSub}>{dateInfo.tooltipSubtitle}</span>
          )}
        </div>
      </div>

      <div className={styles.tooltipDivider} />

      <div className={styles.tooltipMetrics}>
        {chartTab === "evolution" ? (
          <>
            <div className={styles.tooltipMetricRow}>
              <span className={styles.tooltipMetricLabel}>
                <span
                  className={styles.tooltipDot}
                  style={{ background: "var(--accent-primary)" }}
                />
                Período atual
              </span>
              <span className={styles.tooltipMetricValue}>
                {Number(payload[0]?.value ?? 0).toLocaleString("pt-BR")} cliques
              </span>
            </div>
            {payload[1] && Number(payload[1].value) > 0 && (
              <div className={styles.tooltipMetricRow}>
                <span className={styles.tooltipMetricLabel}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: "var(--text-muted)" }}
                  />
                  Período anterior
                </span>
                <span className={styles.tooltipMetricValueMuted}>
                  {Number(payload[1].value).toLocaleString("pt-BR")} cliques
                </span>
              </div>
            )}
          </>
        ) : (
          payload.map((entry, idx) => (
            <div key={entry.dataKey || idx} className={styles.tooltipMetricRow}>
              <span className={styles.tooltipMetricLabel}>
                <span
                  className={styles.tooltipDot}
                  style={{ background: entry.stroke || entry.color || "var(--accent-primary)" }}
                />
                {entry.name || entry.dataKey}
              </span>
              <span className={styles.tooltipMetricValue}>
                {Number(entry.value ?? 0).toLocaleString("pt-BR")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface DashboardChartsProps {
  period?: DashboardPeriodFilter;
  chartTab: "evolution" | "influencer";
  setChartTab: (tab: "evolution" | "influencer") => void;
  chartData: any[];
  influencerEvolution: any[];
  allInfluencers: any[];
}

export function DashboardCharts({
  period = "dia",
  chartTab,
  setChartTab,
  chartData,
  influencerEvolution,
  allInfluencers,
}: DashboardChartsProps) {
  const activeDataset = chartTab === "evolution" ? chartData : influencerEvolution;

  const getDateRangeSummary = () => {
    if (!activeDataset || activeDataset.length === 0) return null;
    const firstRaw = activeDataset[0]?.date;
    const lastRaw = activeDataset[activeDataset.length - 1]?.date;
    if (!firstRaw) return null;

    const first = parseChartDate(String(firstRaw), period);
    if (!lastRaw || firstRaw === lastRaw) {
      return first.tooltipTitle;
    }
    const last = parseChartDate(String(lastRaw), period);
    return `${first.compactRangeLabel} — ${last.compactRangeLabel}`;
  };

  const dateRangeSummary = getDateRangeSummary();

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleGroup}>
          <div className={styles.chartTitleRow}>
            <h2 className={styles.sectionTitle}>
              {chartTab === "evolution" ? "Evolução de Cliques" : "Desempenho por Influenciador"}
            </h2>
            {dateRangeSummary && (
              <span className={styles.dateRangeBadge}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {dateRangeSummary}
              </span>
            )}
          </div>

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
            <LineChart data={chartData} margin={{ top: 10, right: 16, left: -20, bottom: 14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={28}
                padding={{ left: 14, right: 14 }}
                height={36}
                tick={<CustomXAxisTick period={period} />}
              />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                content={<CustomTooltip period={period} chartTab="evolution" />}
                cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="currentPeriodClicks"
                stroke="var(--accent-primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--bg-elevated)", strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--accent-primary)" }}
              />
              <Line
                type="monotone"
                dataKey="previousPeriodClicks"
                stroke="var(--text-muted)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
              />
            </LineChart>
          ) : (
            <LineChart data={influencerEvolution} margin={{ top: 10, right: 16, left: -20, bottom: 14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={28}
                padding={{ left: 14, right: 14 }}
                height={36}
                tick={<CustomXAxisTick period={period} />}
              />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                content={<CustomTooltip period={period} chartTab="influencer" />}
                cursor={{ stroke: "var(--border-accent)", strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              {allInfluencers.map((inf, i) => (
                <Line
                  key={inf.id}
                  type="monotone"
                  dataKey={inf.name}
                  stroke={`hsl(${(i * 137.5) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
