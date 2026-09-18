"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  CompanySection,
  RotationSection,
  ProfileSection,
} from "@/components/ComponentsPage/settingsPage";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGlobalRotation } from "@/hooks/rotation/useGlobalRotation";
import styles from "./settings.module.scss";
import { toast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    rotation: rotationSettings,
    isLoading: isRotationLoading,
    isSaving: isRotationSaving,
    updateRotation,
  } = useGlobalRotation();

  const isLoading = isAuthLoading || isRotationLoading;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Configurações">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdateCompany = async () => {
    // TODO: Connect to an actual update enterprise endpoint when available.
    toast.success("Função de atualização ainda não implementada no back-end.");
    return Promise.resolve();
  };

  return (
    <DashboardLayout pageTitle="Configurações">
      <div className={styles.page}>
        <CompanySection
          companySettings={user?.enterprise || null}
          isSaving={false}
          onSave={handleUpdateCompany}
        />

        <RotationSection
          rotationSettings={rotationSettings}
          isSaving={isRotationSaving}
          onSave={updateRotation}
        />

        <ProfileSection userProfile={user} />
      </div>
    </DashboardLayout>
  );
}
