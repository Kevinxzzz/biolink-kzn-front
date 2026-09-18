import type { DashboardPeriodFilter } from "@/types/analyticsType";
import styles from "@/app/(dashboard)/dashboard/dashboard.module.scss";

interface DashboardHeaderProps {
  period: DashboardPeriodFilter;
  setPeriod: (val: DashboardPeriodFilter) => void;
  filterMode: "all" | "link" | "influencer";
  setFilterMode: (mode: "all" | "link" | "influencer") => void;
  linkFilter: string;
  setLinkFilter: (val: string) => void;
  influencerFilter: string;
  setInfluencerFilter: (val: string) => void;
  setChartTab: (tab: "evolution" | "influencer") => void;
  allLinks: any[];
  allInfluencers: any[];
}

export function DashboardHeader({
  period,
  setPeriod,
  filterMode,
  setFilterMode,
  linkFilter,
  setLinkFilter,
  influencerFilter,
  setInfluencerFilter,
  setChartTab,
  allLinks,
  allInfluencers,
}: DashboardHeaderProps) {
  return (
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
              allLinks.reduce<Record<string, typeof allLinks>>((acc, l) => {
                const cat = l.category?.name || "Sem categoria";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(l);
                return acc;
              }, {})
            ).map(([category, links]) => (
              <optgroup key={category} label={category}>
                {links.map((l: any) => (
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
            {allInfluencers.map((inf) => (
              <option key={inf.id} value={inf.id}>
                {inf.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
