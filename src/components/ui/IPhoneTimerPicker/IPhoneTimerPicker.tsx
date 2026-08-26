"use client";

import React from "react";
import styles from "./IPhoneTimerPicker.module.scss";

export interface TimerValue {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface IPhoneTimerPickerProps {
  value: TimerValue;
  onChange: (newValue: TimerValue) => void;
}

interface ColumnConfig {
  key: keyof TimerValue;
  label: string;
  unitSingular: string;
  unitPlural: string;
  min: number;
  max: number;
}

const COLUMNS: ColumnConfig[] = [
  { key: "months", label: "Mês", unitSingular: "mês", unitPlural: "meses", min: 0, max: 12 },
  { key: "days", label: "Dia", unitSingular: "dia", unitPlural: "dias", min: 0, max: 31 },
  { key: "hours", label: "Hora", unitSingular: "hora", unitPlural: "horas", min: 0, max: 23 },
  { key: "minutes", label: "Minutos", unitSingular: "minuto", unitPlural: "minutos", min: 0, max: 59 },
  { key: "seconds", label: "Segundos", unitSingular: "segundo", unitPlural: "segundos", min: 0, max: 59 },
];

export function IPhoneTimerPicker({ value, onChange }: IPhoneTimerPickerProps) {
  const handleStep = (key: keyof TimerValue, delta: number, max: number, min: number) => {
    const current = value[key];
    let next = current + delta;
    if (next > max) next = min;
    if (next < min) next = max;
    onChange({ ...value, [key]: next });
  };

  const handleInputChange = (key: keyof TimerValue, valStr: string, max: number, min: number) => {
    let parsed = parseInt(valStr, 10);
    if (isNaN(parsed)) parsed = 0;
    if (parsed > max) parsed = max;
    if (parsed < min) parsed = min;
    onChange({ ...value, [key]: parsed });
  };

  const handleWheel = (e: React.WheelEvent, key: keyof TimerValue, max: number, min: number) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    handleStep(key, delta, max, min);
  };

  const formatSummary = () => {
    const parts: string[] = [];
    COLUMNS.forEach((col) => {
      const val = value[col.key];
      if (val > 0) {
        const unit = val === 1 ? col.unitSingular : col.unitPlural;
        parts.push(`${val} ${unit}`);
      }
    });

    if (parts.length === 0) return "Nenhum intervalo selecionado (0 min).";
    if (parts.length === 1) return parts[0];
    const last = parts.pop();
    return `${parts.join(", ")} e ${last}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pickerWrapper}>
        <div className={styles.selectionHighlight} />
        {COLUMNS.map((col) => {
          const val = value[col.key];
          const formattedVal = String(val).padStart(2, "0");

          return (
            <div
              key={col.key}
              className={styles.column}
              onWheel={(e) => handleWheel(e, col.key, col.max, col.min)}
            >
              <span className={styles.columnLabel}>{col.label}</span>
              <div className={styles.wheelControl}>
                <button
                  type="button"
                  aria-label={`Aumentar ${col.label}`}
                  className={styles.stepBtn}
                  onClick={() => handleStep(col.key, 1, col.max, col.min)}
                >
                  ▲
                </button>
                <div className={styles.valueSlot}>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={styles.valueInput}
                    value={formattedVal}
                    onChange={(e) => handleInputChange(col.key, e.target.value, col.max, col.min)}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Diminuir ${col.label}`}
                  className={styles.stepBtn}
                  onClick={() => handleStep(col.key, -1, col.max, col.min)}
                >
                  ▼
                </button>
              </div>
              <span className={styles.unitText}>{col.label}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.summaryBadge}>
        <span>⏱️ Intervalo do Timer:</span> {formatSummary()}
      </div>
    </div>
  );
}
