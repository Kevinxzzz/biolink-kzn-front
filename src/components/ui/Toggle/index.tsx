"use client";

import styles from "./Toggle.module.scss";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  const handleToggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <label className={`${styles.toggleContainer} ${disabled ? styles.toggleContainerDisabled : ""}`}>
      <div className={`${styles.switch} ${checked ? styles.switchActive : ""}`}>
        <div className={`${styles.knob} ${checked ? styles.knobActive : ""}`} />
      </div>
      {label && <span className={`${styles.label} ${disabled ? styles.labelDisabled : ""}`}>{label}</span>}
      <input
        type="checkbox"
        className={styles.hiddenInput}
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
      />
    </label>
  );
}
