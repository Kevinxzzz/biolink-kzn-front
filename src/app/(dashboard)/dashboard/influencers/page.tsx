"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useUpdateInfluencer, useCreateInfluencer } from "@/hooks/useInfluencerMutations";
import { SharedModal } from "@/components/ui/SharedModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toggle } from "@/components/ui/Toggle";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { usePlatforms } from "@/hooks/usePlatforms";
import { generateSlug } from "@/utils/slug";
import type { Influencer, InfluencerPlatform } from "@/types/influencerType";
import styles from "./influencers.module.scss";

export default function InfluencersPage() {
  const { influencers, isLoading, refetch } = useInfluencers();
  const { updateStatus, updatePlatforms, isUpdating } = useUpdateInfluencer();
  const { create, isCreating } = useCreateInfluencer();
  const { platforms } = usePlatforms();

  const platformOptions = platforms.map(p => ({ value: p.id, label: p.name }));

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
  const [formPlatforms, setFormPlatforms] = useState<InfluencerPlatform[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create form state
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createAvatar, setCreateAvatar] = useState("");
  const [createPlats, setCreatePlats] = useState<InfluencerPlatform[]>([]);

  const handleToggleStatus = async (influencerId: string, isActive: boolean) => {
    try {
      await updateStatus(influencerId, isActive ? "ACTIVE" : "INACTIVE");
      refetch();
    } catch { }
  };

  const openPlatformsModal = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setFormPlatforms([...influencer.platforms]);
  };

  const handlePlatformChange = (index: number, field: keyof InfluencerPlatform, value: string) => {
    const newPlats = [...formPlatforms];
    if (field === "name") {
      const selected = platforms.find(p => p.id === value);
      if (selected) {
        newPlats[index] = { ...newPlats[index], name: selected.name };
      }
    } else {
      newPlats[index] = { ...newPlats[index], [field]: value };
    }
    setFormPlatforms(newPlats);
  };

  const addPlatformRow = () => {
    setFormPlatforms([...formPlatforms, { id: `plat_${Date.now()}`, name: "", url: "" }]);
  };

  const removePlatformRow = (index: number) => {
    setFormPlatforms(formPlatforms.filter((_, i) => i !== index));
  };

  const handleSavePlatforms = async () => {
    if (!editingInfluencer) return;
    try {
      await updatePlatforms(editingInfluencer.id, formPlatforms);
      setEditingInfluencer(null);
      refetch();
    } catch { }
  };

  const handleCreateSubmit = async () => {
    try {
      await create({
        name: createName,
        email: createEmail,
        password: createPassword,
        avatarUrl: createAvatar,
        platforms: createPlats
      });
      setIsCreateModalOpen(false);
      refetch();
    } catch { }
  };

  const openCreateModal = () => {
    setCreateName(""); setCreateEmail(""); setCreatePassword(""); setCreateAvatar(""); setCreatePlats([]);
    setIsCreateModalOpen(true);
  };

  const handleCreatePlatChange = (index: number, field: keyof InfluencerPlatform, value: string) => {
    const newPlats = [...createPlats];
    if (field === "name") {
      const selected = platforms.find(p => p.id === value);
      if (selected) {
        newPlats[index] = { ...newPlats[index], name: selected.name };
      }
    } else {
      newPlats[index] = { ...newPlats[index], [field]: value };
    }
    setCreatePlats(newPlats);
  };

  const addCreatePlat = () => setCreatePlats([...createPlats, { id: `plat_${Date.now()}`, name: "", url: "" }]);
  const removeCreatePlat = (index: number) => setCreatePlats(createPlats.filter((_, i) => i !== index));

  const handleCopyLink = async (influencer: Influencer) => {
    const slug = influencer.slug || generateSlug(influencer.name);
    const link = `${process.env.API_URL || "http://localhost:3000"}/${slug}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(influencer.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Influenciadores"><div className={styles.loadingState}><div className={styles.spinner} /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Influenciadores">
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p className={styles.pageDescription}>Acompanhe e gerencie os influenciadores associados à sua empresa.</p>
          <button
            onClick={openCreateModal}
            type="button"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem",
              fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: "var(--accent-primary)",
              border: "none", borderRadius: "9999px", cursor: "pointer"
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar influenciador
          </button>
        </div>
      </div>

      {influencers.length === 0 ? (
        <EmptyState
          title="Nenhum influenciador vinculado"
          description="Você ainda não possui influenciadores vinculados à sua empresa. Gere um convite na aba 'Tokens de Convite' para adicionar novos membros."
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
      ) : (
        <div className={styles.grid}>
          {influencers.map(influencer => (
            <div key={influencer.id} className={styles.card}>

              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {influencer.avatarUrl ? <img src={influencer.avatarUrl} alt={influencer.name} /> : influencer.name.charAt(0)}
                </div>
                <Toggle
                  checked={influencer.status === "ACTIVE"}
                  onChange={(c) => handleToggleStatus(influencer.id, c)}
                />
              </div>

              <div className={styles.info}>
                <div className={styles.name}>{influencer.name}</div>
                <div className={styles.email}>{influencer.email}</div>

                <div className={styles.publicLinkBox}>
                  <div className={styles.publicLinkUrl}>

                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{influencer.slug || generateSlug(influencer.name)}</span>
                  </div>
                  <button
                    className={`${styles.copyBtn} ${copiedId === influencer.id ? styles.copied : ""}`}
                    onClick={() => handleCopyLink(influencer)}
                    type="button"
                  >
                    {copiedId === influencer.id ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        Copiar link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Total de Cliques</span>
                  <span className={styles.metricValue}>{influencer.clicks.toLocaleString()}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Plataformas</span>
                  <span className={styles.metricValue}>{influencer.platforms.length}</span>
                </div>
              </div>

              {influencer.platforms.length > 0 && (
                <div className={styles.platforms}>
                  {influencer.platforms.map(p => (
                    <span key={p.id} className={styles.platformBadge}>{p.name}</span>
                  ))}
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.manageButton} onClick={() => openPlatformsModal(influencer)} type="button">
                  Gerenciar Plataformas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manage Platforms Modal */}
      <SharedModal isOpen={!!editingInfluencer} onClose={() => setEditingInfluencer(null)} title="Gerenciar Plataformas" description="Adicione as URLs das redes sociais deste influenciador."
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={handleSavePlatforms} disabled={isUpdating}>
            {isUpdating ? "Salvando..." : "Salvar Plataformas"}
          </button>
        }
      >
        <div className={styles.form}>
          {formPlatforms.map((plat, idx) => (
            <div key={plat.id} className={styles.platformRow}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Select
                  id={`name-${plat.id}`}
                  name="name"
                  label="Plataforma"
                  value={platforms.find(p => p.name === plat.name)?.id || ""}
                  onChange={(e) => handlePlatformChange(idx, "name", e.target.value)}
                  options={[{ value: "", label: "Selecione uma plataforma..." }, ...platformOptions]}
                />
                <Input id={`url-${plat.id}`} name="url" label="URL" value={plat.url} onChange={(e) => handlePlatformChange(idx, "url", e.target.value)} placeholder="https://" />
              </div>
              <button className={styles.removePlatBtn} onClick={() => removePlatformRow(idx)} type="button" title="Remover">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}

          <button className={styles.addPlatBtn} onClick={addPlatformRow} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar URL
          </button>
        </div>
      </SharedModal>

      {/* Create Influencer Modal */}
      <SharedModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Adicionar influenciador"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={handleCreateSubmit} disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar Influenciador"}
          </button>
        }
      >
        <div className={styles.form}>
          <Input id="create-name" name="name" label="Nome Completo" value={createName} onChange={(e) => setCreateName(e.target.value)} required />
          <Input id="create-email" name="email" type="email" label="Email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} required />
          <Input id="create-password" name="password" type="password" label="Senha provisória" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required />
          <Input id="create-avatar" name="avatar" label="URL do Avatar (opcional)" value={createAvatar} onChange={(e) => setCreateAvatar(e.target.value)} />

          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>Redes Sociais (Opcional)</h4>
            {createPlats.map((plat, idx) => (
              <div key={plat.id} className={styles.platformRow}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <Select
                    id={`cname-${plat.id}`}
                    name="name"
                    label="Plataforma"
                    value={platforms.find(p => p.name === plat.name)?.id || ""}
                    onChange={(e) => handleCreatePlatChange(idx, "name", e.target.value)}
                    options={[{ value: "", label: "Selecione uma plataforma..." }, ...platformOptions]}
                  />
                  <Input id={`curl-${plat.id}`} name="url" label="URL" value={plat.url} onChange={(e) => handleCreatePlatChange(idx, "url", e.target.value)} placeholder="https://" />
                </div>
                <button className={styles.removePlatBtn} onClick={() => removeCreatePlat(idx)} type="button" title="Remover">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
            <button className={styles.addPlatBtn} onClick={addCreatePlat} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="16" height="16">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar URL
            </button>
          </div>
        </div>
      </SharedModal>
    </DashboardLayout>
  );
}
