"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  CompanySection,
  RotationSection,
  ProfileSection,
} from "@/components/ComponentsPage/settingsPage";
import { useSettings } from "@/hooks/useSettings";
import { useGlobalRotation } from "@/hooks/useGlobalRotation";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const {
    companySettings,
    userProfile,
    isLoading: isSettingsLoading,
    isSaving: isSettingsSaving,
    updateCompany,
  } = useSettings();

  const {
    rotation: rotationSettings,
    isLoading: isRotationLoading,
    isSaving: isRotationSaving,
    updateRotation,
  } = useGlobalRotation();

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

  return (
    <DashboardLayout pageTitle="Configurações">
      <div className={styles.page}>
        <CompanySection
          companySettings={companySettings}
          isSaving={isSettingsSaving}
          onSave={updateCompany}
        />

        <RotationSection
          rotationSettings={rotationSettings}
          isSaving={isRotationSaving}
          onSave={updateRotation}
        />

        <ProfileSection userProfile={userProfile} />
      </div>
    </DashboardLayout>
  );
}
