"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { TimerValue } from "@/components/ui/IPhoneTimerPicker";
import { SubTitleDashboard } from "@/components/layout/DashboardLayout";
import { toast } from "@/components/ui/Toast";
import type { CategoryRotation, ToggleType, UpdateCategoryRotationPayload } from "@/types/categoryType";
import { TimerConfig } from "./TimerConfig";
import { ScheduleConfig } from "./ScheduleConfig";
import { LimitClicksConfig } from "./LimitClicksConfig";
import { ManualConfig } from "./ManualConfig";
import styles from "./RotationSection.module.scss";

const ROTATION_TYPE_OPTIONS = [
  { value: "MANUAL", label: "Manual (sem rotação automática)" },
  { value: "TIMER", label: "Timer" },
  { value: "SCHEDULE", label: "Agendamento" },
  { value: "LIMITCLICKS", label: "Limite de cliques" },
];

interface RotationSectionProps {
  rotationSettings?: CategoryRotation | null;
  isSaving: boolean;
  onSave: (payload: UpdateCategoryRotationPayload) => Promise<unknown>;
}

export function RotationSection({ rotationSettings, isSaving, onSave }: RotationSectionProps) {
  const [rotationType, setRotationType] = useState<ToggleType>("MANUAL");
  const [timerValue, setTimerValue] = useState<TimerValue>({
    months: 0,
    days: 0,
    hours: 1,
    minutes: 0,
    seconds: 0,
  });
  const [limitClicks, setLimitClicks] = useState<number>(1000);

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
      } else {
        setLimitClicks(1000);
      }
    }
  }, [rotationSettings]);

  // Check if there are unsaved modifications
  const initialType = rotationSettings?.toggleType || "MANUAL";
  const initialTimerMinutes =
    rotationSettings?.toggleType === "TIMER" && rotationSettings?.timerInMinutes
      ? rotationSettings.timerInMinutes
      : 60;
  const initialLimitClicks =
    rotationSettings?.toggleType === "LIMITCLICKS" && rotationSettings?.limitClicks
      ? rotationSettings.limitClicks
      : 1000;

  const currentTimerMinutes =
    timerValue.months * 30 * 24 * 60 +
    timerValue.days * 24 * 60 +
    timerValue.hours * 60 +
    timerValue.minutes +
    Math.round(timerValue.seconds / 60);

  const hasTypeChanged = rotationType !== initialType;
  const hasTimerChanged =
    rotationType === "TIMER" && currentTimerMinutes !== initialTimerMinutes;
  const hasLimitClicksChanged =
    rotationType === "LIMITCLICKS" && limitClicks !== initialLimitClicks;

  const hasChanges = hasTypeChanged || hasTimerChanged || hasLimitClicksChanged;

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

      await onSave(payload);
      toast.success("Configuração de rotação salva com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao salvar rotação." });
    }
  };

  return (
    <section className={styles.section}>
      <SubTitleDashboard
        subtitle="Mecanismo de rotação"
        description="Configure o tipo de rotação automática ou manual dos seus links."
      />

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

        <div className={styles.typeConfigContainer}>
          {rotationType === "TIMER" && (
            <TimerConfig value={timerValue} onChange={setTimerValue} />
          )}

          {rotationType === "SCHEDULE" && <ScheduleConfig />}

          {rotationType === "LIMITCLICKS" && (
            <LimitClicksConfig limitClicks={limitClicks} onChange={setLimitClicks} />
          )}

          {rotationType === "MANUAL" && <ManualConfig />}
        </div>

        {hasChanges && (
          <button
            className={styles.saveButton}
            onClick={handleSaveRotation}
            disabled={isSaving}
            type="button"
          >
            {isSaving ? "Salvando..." : "Salvar Configuração"}
          </button>
        )}
      </div>
    </section>
  );
}
