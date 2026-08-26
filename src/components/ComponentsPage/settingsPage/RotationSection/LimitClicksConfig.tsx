"use client";

import { Input } from "@/components/ui/Input";
import styles from "./RotationSection.module.scss";

interface LimitClicksConfigProps {
  limitClicks: number;
  onChange: (limit: number) => void;
}

export function LimitClicksConfig({ limitClicks, onChange }: LimitClicksConfigProps) {
  return (
    <div className={styles.formGrid}>
      <Input
        id="limit-clicks"
        name="limitClicks"
        label="Limite de Cliques por Link"
        type="number"
        placeholder="Ex: 1000"
        value={limitClicks.toString()}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className={`${styles.fullWidth} ${styles.hintBox}`}>
        <span>🎯</span>
        <span>
          Assim que o link ativo atingir esse número acumulado de cliques, o próximo link da categoria
          será ativado.
        </span>
      </div>
    </div>
  );
}
