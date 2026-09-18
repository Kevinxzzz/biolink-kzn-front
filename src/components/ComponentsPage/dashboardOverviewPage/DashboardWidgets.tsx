"use client";

import styles from "@/app/(dashboard)/dashboard/dashboard.module.scss";

interface DashboardWidgetsProps {
  widgetTab: "links" | "influencers" | "status";
  setWidgetTab: (tab: "links" | "influencers" | "status") => void;
  activeLinks: any[];
  topLinks: any[];
  topInfluencers: any[];
}

export function DashboardWidgets({
  widgetTab,
  setWidgetTab,
  activeLinks,
  topLinks,
  topInfluencers,
}: DashboardWidgetsProps) {
  return (
    <>
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
            {topLinks.map((link) => (
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
            {topInfluencers.map((inf) => (
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
    </>
  );
}
