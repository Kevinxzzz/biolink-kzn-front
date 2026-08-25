"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { IPhoneTimerPicker, TimerValue } from "@/components/ui/IPhoneTimerPicker";
import { SharedModal } from "@/components/ui/SharedModal";
import { toast } from "@/components/ui/Toast";
import { useSettings } from "@/hooks/useSettings";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryRotation } from "@/hooks/useCategoryRotation";
import { useLinks } from "@/hooks/useLinks";
import { useSchedules } from "@/hooks/useSchedules";
import { useCreateSchedule, useUpdateSchedule } from "@/hooks/useScheduleMutations";
import type { ToggleType, UpdateCategoryRotationPayload } from "@/types/categoryType";
import type { Schedule } from "@/types/scheduleType";
import styles from "./settings.module.scss";

const ROTATION_TYPE_OPTIONS = [
  { value: "MANUAL", label: "Manual (sem rotação automática)" },
  { value: "TIMER", label: "Timer" },
  { value: "SCHEDULE", label: "Agendamento" },
  { value: "LIMITCLICKS", label: "Limite de cliques" },
];

export default function SettingsPage() {
  const { companySettings, userProfile, isLoading: isSettingsLoading, isSaving: isSettingsSaving, updateCompany } = useSettings();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const efootballCategory = categories.find(c => c.name === "efootball");
  
  const { 
    rotation: rotationSettings, 
    isLoading: isRotationLoading, 
    isSaving: isRotationSaving, 
    updateRotation 
  } = useCategoryRotation(efootballCategory?.id);
  
  const { links } = useLinks();

  const { schedules, isLoading: isSchedulesLoading } = useSchedules();
  const { create: createSchedule, isCreating: isScheduleCreating } = useCreateSchedule();
  const { update: updateSchedule, isUpdating: isScheduleUpdating } = useUpdateSchedule();

  const [formCompany, setFormCompany] = useState({ name: "", email: "", phone: "" });

  // Rotation State
  const [rotationType, setRotationType] = useState<ToggleType>("MANUAL");
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

  // Edit Schedule Modal State
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editLinkId, setEditLinkId] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [editActive, setEditActive] = useState<string>("true");

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
      setRotationType(rotationSettings.toggleType);
      
      if (rotationSettings.toggleType === "TIMER" && rotationSettings.timerInMinutes) {
        const totalMins = rotationSettings.timerInMinutes;
        const hrs = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        setTimerValue({ months: 0, days: 0, hours: hrs, minutes: mins, seconds: 0 });
      } else {
        setTimerValue({ months: 0, days: 0, hours: 1, minutes: 0, seconds: 0 });
      }

      if (rotationSettings.toggleType === "LIMITCLICKS" && rotationSettings.limitClicks) {
        setLimitClicks(rotationSettings.limitClicks);
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
      const payload: UpdateCategoryRotationPayload = { toggleType: rotationType };

      if (rotationType === "TIMER") {
        const totalMinutesFromTimer =
          timerValue.months * 30 * 24 * 60 +
          timerValue.days * 24 * 60 +
          timerValue.hours * 60 +
          timerValue.minutes +
          Math.round(timerValue.seconds / 60);
        payload.timerInMinutes = totalMinutesFromTimer > 0 ? totalMinutesFromTimer : 60;
      }

      if (rotationType === "LIMITCLICKS") {
        payload.limitClicks = limitClicks;
      }

      await updateRotation(payload);
    } catch { }
  };

  const handleCreateSchedule = async () => {
    if (!scheduledLinkId || !scheduledDate) return;
    try {
      await createSchedule({ enterpriseUrlId: scheduledLinkId, dateTime: new Date(scheduledDate).toISOString() });
      toast.success("Agendamento criado com sucesso!");
      setScheduledDate("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao criar agendamento." });
    }
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setEditLinkId(schedule.enterpriseUrlId);
    
    const d = new Date(schedule.dateTime);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setEditDate(d.toISOString().slice(0, 16));
    
    setEditActive(schedule.active ? "true" : "false");
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule || !editLinkId || !editDate) return;
    try {
      await updateSchedule(editingSchedule.id, { 
        enterpriseUrlId: editLinkId, 
        dateTime: new Date(editDate).toISOString(),
        active: editActive === "true"
      });
      toast.success("Agendamento atualizado com sucesso!");
      setEditingSchedule(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao atualizar agendamento." });
    }
  };

  const isLoading = isSettingsLoading || isCategoriesLoading || isRotationLoading || isSchedulesLoading;

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
                onChange={(e) => setRotationType(e.target.value as ToggleType)}
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

                  <div className={styles.fullWidth}>
                    <button 
                      className={styles.saveButton} 
                      onClick={handleCreateSchedule} 
                      disabled={isScheduleCreating || !scheduledLinkId || !scheduledDate} 
                      type="button"
                    >
                      {isScheduleCreating ? "Criando..." : "Criar Agendamento"}
                    </button>
                  </div>

                  <div className={`${styles.fullWidth} ${styles.scheduleListContainer}`}>
                    <h3 className={styles.scheduleListTitle}>Agendamentos Cadastrados</h3>
                    {schedules.length === 0 ? (
                      <p className={styles.sectionDescription}>Nenhum agendamento encontrado.</p>
                    ) : (
                      <div className={styles.scheduleList}>
                        {schedules.map((schedule) => (
                          <div key={schedule.id} className={styles.scheduleItem}>
                            <div className={styles.scheduleItemInfo}>
                              <span className={styles.scheduleItemDate}>
                                {new Date(schedule.dateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                              <span className={styles.scheduleItemLink}>
                                {schedule.enterpriseUrl?.title || schedule.enterpriseUrl?.url || "Link excluído"}
                              </span>
                            </div>
                            <div className={styles.scheduleItemActions}>
                              <span className={`${styles.statusBadge} ${schedule.active ? styles.active : styles.inactive}`}>
                                {schedule.active ? "Ativo" : "Inativo"}
                              </span>
                              <button 
                                className={styles.editButton} 
                                onClick={() => openEditModal(schedule)}
                                type="button"
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

      <SharedModal 
        isOpen={!!editingSchedule} 
        onClose={() => setEditingSchedule(null)} 
        title="Editar Agendamento" 
        size="small"
      >
        <div className={styles.modalForm}>
          <Select
            id="edit-scheduled-link"
            name="editScheduledLink"
            label="Link vinculado"
            value={editLinkId}
            onChange={(e) => setEditLinkId(e.target.value)}
            options={linkSelectOptions}
          />
          <Input
            id="edit-scheduled-date"
            name="editScheduledDate"
            label="Dia e Horário"
            type="datetime-local"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />
          <Select
            id="edit-scheduled-status"
            name="editScheduledStatus"
            label="Status"
            value={editActive}
            onChange={(e) => setEditActive(e.target.value)}
            options={[
              { value: "true", label: "Ativo" },
              { value: "false", label: "Inativo" },
            ]}
          />
          <button 
            className={styles.saveButton} 
            onClick={handleUpdateSchedule} 
            disabled={isScheduleUpdating || !editLinkId || !editDate} 
            type="button"
            style={{ marginTop: '16px', width: '100%' }}
          >
            {isScheduleUpdating ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </SharedModal>
    </DashboardLayout>
  );
}
