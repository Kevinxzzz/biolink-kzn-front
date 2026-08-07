"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { useSettings } from "@/hooks/useSettings";
import { useRotationSettings } from "@/hooks/useRotationSettings";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const { companySettings, userProfile, isLoading: isSettingsLoading, isSaving: isSettingsSaving, updateCompany } = useSettings();
  const { settings: rotationSettings, isLoading: isRotationLoading, isSaving: isRotationSaving, updateSettings: updateRotation } = useRotationSettings();

  const [formCompany, setFormCompany] = useState({ name: "", email: "", phone: "" });
  const [formRotation, setFormRotation] = useState({ isActive: false, intervalMinutes: 0 });

  useEffect(() => {
    if (companySettings) {
      setFormCompany({
        name: companySettings.name,
        email: companySettings.email,
        phone: companySettings.phone,
      });
    }
  }, [companySettings]);

  useEffect(() => {
    if (rotationSettings) {
      setFormRotation({
        isActive: rotationSettings.isActive,
        intervalMinutes: rotationSettings.intervalMinutes,
      });
    }
  }, [rotationSettings]);

  const handleSaveCompany = async () => {
    try {
      await updateCompany(formCompany);
      // Optional: show success toast
    } catch {}
  };

  const handleSaveRotation = async () => {
    try {
      await updateRotation(formRotation);
    } catch {}
  };

  const isLoading = isSettingsLoading || isRotationLoading;

  if (isLoading) {
    return <DashboardLayout pageTitle="Configurações"><div className={styles.loadingState}><div className={styles.spinner} /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Configurações">
      <div className={styles.page}>
        
        {/* ================= COMPANY ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dados da Empresa</h2>
            <p className={styles.sectionDescription}>Gerencie as informações públicas e de contato da sua empresa.</p>
          </div>
          
          <div className={styles.sectionContent}>
            <div className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <Input id="company-name" name="name" label="Nome da Empresa" value={formCompany.name} onChange={(e) => setFormCompany({ ...formCompany, name: e.target.value })} />
              </div>
              <Input id="company-email" name="email" label="Email de Contato" type="email" value={formCompany.email} onChange={(e) => setFormCompany({ ...formCompany, email: e.target.value })} />
              <Input id="company-phone" name="phone" label="Telefone" value={formCompany.phone} onChange={(e) => setFormCompany({ ...formCompany, phone: e.target.value })} />
            </div>
            <button className={styles.saveButton} onClick={handleSaveCompany} disabled={isSettingsSaving} type="button">
              {isSettingsSaving ? "Salvando..." : "Salvar Dados da Empresa"}
            </button>
          </div>
        </section>

        {/* ================= ROTATION ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mecanismo de Rotação</h2>
            <p className={styles.sectionDescription}>Configure a regra global de rotação automática dos seus links.</p>
          </div>
          
          <div className={styles.sectionContent}>
            <div className={styles.rotationRow}>
              <div className={styles.rotationInfo}>
                <span className={styles.rotationLabel}>Rotação Global</span>
                <span className={styles.rotationDesc}>Ativando a rotação global, o link configurado como &quot;Principal&quot; receberá todo o tráfego do seu Biolink público, e será trocado automaticamente no intervalo configurado.</span>
              </div>
              <Toggle checked={formRotation.isActive} onChange={(val) => setFormRotation({ ...formRotation, isActive: val })} />
            </div>

            {formRotation.isActive && (
              <div className={styles.intervalInput}>
                <span className={styles.intervalText}>Trocar link a cada</span>
                <div style={{ width: "120px" }}>
                  <Input id="interval" name="interval" label="Minutos" type="number" value={formRotation.intervalMinutes.toString()} onChange={(e) => setFormRotation({ ...formRotation, intervalMinutes: Number(e.target.value) })} />
                </div>
                <span className={styles.intervalText}>minutos</span>
              </div>
            )}

            <button className={styles.saveButton} onClick={handleSaveRotation} disabled={isRotationSaving} type="button">
              {isRotationSaving ? "Salvando..." : "Salvar Configuração"}
            </button>
          </div>
        </section>

        {/* ================= PROFILE ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Seu Perfil</h2>
            <p className={styles.sectionDescription}>Suas informações pessoais de acesso.</p>
          </div>
          
          <div className={styles.sectionContent}>
            <div className={styles.formGrid}>
              <Input id="profile-name" name="name" label="Seu Nome" value={userProfile?.name || ""} onChange={() => {}} disabled />
              <Input id="profile-email" name="email" label="Seu Email" value={userProfile?.email || ""} onChange={() => {}} disabled />
            </div>
            <div>
              <span className={styles.intervalText} style={{ display: 'block', marginBottom: '4px' }}>Nível de Acesso</span>
              <span className={styles.roleBadge}>{userProfile?.role}</span>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
