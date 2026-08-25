"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { SubTitleDashboard } from "@/components/layout/DashboardLayout";
import { toast } from "@/components/ui/Toast";
import styles from "./CompanySection.module.scss";

interface CompanySettingsData {
  name: string;
  email: string;
  phone: string;
}

interface CompanySectionProps {
  companySettings?: CompanySettingsData | null;
  isSaving: boolean;
  onSave: (data: CompanySettingsData) => Promise<unknown>;
}

export function CompanySection({ companySettings, isSaving, onSave }: CompanySectionProps) {
  const [formCompany, setFormCompany] = useState<CompanySettingsData>({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (companySettings) {
      setFormCompany({
        name: companySettings.name || "",
        email: companySettings.email || "",
        phone: companySettings.phone || "",
      });
    }
  }, [companySettings]);

  const handleSave = async () => {
    try {
      await onSave(formCompany);
      toast.success("Dados da empresa salvos com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao salvar dados da empresa." });
    }
  };

  return (
    <section className={styles.section}>
      <SubTitleDashboard
        subtitle="Dados da Empresa"
        description="Gerencie as informações públicas e de contato da sua empresa."
      />

      <div className={styles.sectionContent}>
        <div className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <Input
              id="company-name"
              name="name"
              label="Nome da Empresa"
              value={formCompany.name}
              onChange={(e) => setFormCompany({ ...formCompany, name: e.target.value })}
            />
          </div>
          <Input
            id="company-email"
            name="email"
            label="Email de Contato"
            type="email"
            value={formCompany.email}
            onChange={(e) => setFormCompany({ ...formCompany, email: e.target.value })}
          />
          <Input
            id="company-phone"
            name="phone"
            label="Telefone"
            value={formCompany.phone}
            onChange={(e) => setFormCompany({ ...formCompany, phone: e.target.value })}
          />
        </div>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving}
          type="button"
        >
          {isSaving ? "Salvando..." : "Salvar Dados da Empresa"}
        </button>
      </div>
    </section>
  );
}
