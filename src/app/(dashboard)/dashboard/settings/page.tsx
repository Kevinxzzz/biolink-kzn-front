"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { IPhoneTimerPicker, TimerValue } from "@/components/ui/IPhoneTimerPicker";
import { useSettings } from "@/hooks/useSettings";
import { useRotationSettings } from "@/hooks/useRotationSettings";
import { useLinks } from "@/hooks/useLinks";
import styles from "./settings.module.scss";

type RotationType = "MANUAL" | "TIMER" | "SCHEDULE" | "LIMITCLICKS";

const ROTATION_TYPE_OPTIONS = [
  { value: "MANUAL", label: "Manual (sem rotação automática)" },
  { value: "TIMER", label: "Timer" },
  { value: "SCHEDULE", label: "Agendamento" },
  { value: "LIMITCLICKS", label: "Limite de cliques" },
];

export default function SettingsPage() {
  const { companySettings, userProfile, isLoading: isSettingsLoading, isSaving: isSettingsSaving, updateCompany } = useSettings();
  const { settings: rotationSettings, isLoading: isRotationLoading, isSaving: isRotationSaving, updateSettings: updateRotation } = useRotationSettings();
  const { links } = useLinks();

  const [formCompany, setFormCompany] = useState({ name: "", email: "", phone: "" });

  // Rotation State
  const [rotationType, setRotationType] = useState<RotationType>("MANUAL");
  const [timerValue, setTimerValue] = useState<TimerValue>({
    months: 0,
    days: 0,
    hours: 1,
    minutes: 0,
    seconds: 0,
  });
  const [scheduledLinkId, setScheduledLinkId] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [limitClicks, setLimitClicks] = useState<number>(1000);

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
      if (rotationSettings.isActive) {
        setRotationType("TIMER");
        const totalMins = rotationSettings.intervalMinutes || 60;
        const hrs = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        setTimerValue({ months: 0, days: 0, hours: hrs, minutes: mins, seconds: 0 });
      } else {
        setRotationType("MANUAL");
      }
    }
  }, [rotationSettings]);

  useEffect(() => {
    if (links && links.length > 0 && !scheduledLinkId) {
      setScheduledLinkId(links[0].id);
    }
  }, [links, scheduledLinkId]);

  const handleSaveCompany = async () => {
    try {
      await updateCompany(formCompany);
    } catch { }
  };

  const handleSaveRotation = async () => {
    try {
      const totalMinutesFromTimer =
        timerValue.months * 30 * 24 * 60 +
        timerValue.days * 24 * 60 +
        timerValue.hours * 60 +
        timerValue.minutes +
        Math.round(timerValue.seconds / 60);

      await updateRotation({
        isActive: rotationType !== "MANUAL",
        intervalMinutes: totalMinutesFromTimer > 0 ? totalMinutesFromTimer : 60,
      });
    } catch { }
  };

  const isLoading = isSettingsLoading || isRotationLoading;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Configurações">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </DashboardLayout>
    );
  }

  const linkSelectOptions = links.map((link) => ({
    value: link.id,
    label: link.title ? `${link.title} (${link.url})` : link.url,
  }));

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
            <h2 className={styles.sectionTitle}>Mecanismo de rotação</h2>
            <p className={styles.sectionDescription}>Configure o tipo de rotação automática ou manual dos seus links.</p>
          </div>

          <div className={styles.sectionContent}>
            <div className={styles.typeSelectorWrapper}>
              <Select
                id="rotation-type"
                name="rotationType"
                label="Tipo de Rotação"
                value={rotationType}
                onChange={(e) => setRotationType(e.target.value as RotationType)}
                options={ROTATION_TYPE_OPTIONS}
              />
            </div>

            {/* Dynamic Specific Config based on Rotation Type */}
            <div className={styles.typeConfigContainer}>
              {rotationType === "TIMER" && (
                <IPhoneTimerPicker value={timerValue} onChange={setTimerValue} />
              )}

              {rotationType === "SCHEDULE" && (
                <div className={styles.formGrid}>
                  <Select
                    id="scheduled-link"
                    name="scheduledLink"
                    label="Selecione o Link para Agendamento"
                    value={scheduledLinkId}
                    onChange={(e) => setScheduledLinkId(e.target.value)}
                    options={
                      linkSelectOptions.length > 0
                        ? linkSelectOptions
                        : [{ value: "", label: "Nenhum link cadastrado" }]
                    }
                    disabled={linkSelectOptions.length === 0}
                  />

                  <Input
                    id="scheduled-date"
                    name="scheduledDate"
                    label="Dia e Horário do Agendamento"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />

                  <div className={`${styles.fullWidth} ${styles.hintBox}`}>
                    <span>📅</span>
                    <span>
                      No dia e horário especificados, o link selecionado será ativado automaticamente.
                    </span>
                  </div>
                </div>
              )}

              {rotationType === "LIMITCLICKS" && (
                <div className={styles.formGrid}>
                  <Input
                    id="limit-clicks"
                    name="limitClicks"
                    label="Limite de Cliques por Link"
                    type="number"
                    placeholder="Ex: 1000"
                    value={limitClicks.toString()}
                    onChange={(e) => setLimitClicks(Number(e.target.value))}
                  />

                  <div className={`${styles.fullWidth} ${styles.hintBox}`}>
                    <span>🎯</span>
                    <span>
                      Assim que o link ativo atingir esse número acumulado de cliques, o próximo link da categoria será ativado.
                    </span>
                  </div>
                </div>
              )}

              {rotationType === "MANUAL" && (
                <div className={styles.manualBox}>
                  <div className={styles.manualBadge}>
                    <span>📌 Modo Manual Ativo</span>
                  </div>
                  <p className={styles.manualText}>
                    No modo manual, os links mantêm o estado definido por você. A rotação automática fica desativada e você altera o link ativo quando desejar diretamente no gerenciador.
                  </p>
                </div>
              )}
            </div>

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
              <Input id="profile-name" name="name" label="Seu Nome" value={userProfile?.name || ""} onChange={() => { }} disabled />
              <Input id="profile-email" name="email" label="Seu Email" value={userProfile?.email || ""} onChange={() => { }} disabled />
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
