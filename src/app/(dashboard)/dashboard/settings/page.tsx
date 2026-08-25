"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  CompanySection,
  RotationSection,
  ProfileSection,
} from "@/components/ComponentsPage/settingsPage";
import { useSettings } from "@/hooks/useSettings";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryRotation } from "@/hooks/useCategoryRotation";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const {
    companySettings,
    userProfile,
    isLoading: isSettingsLoading,
    isSaving: isSettingsSaving,
    updateCompany,
  } = useSettings();

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const efootballCategory = categories.find((c) => c.name === "efootball");

  const {
    rotation: rotationSettings,
    isLoading: isRotationLoading,
    isSaving: isRotationSaving,
    updateRotation,
  } = useCategoryRotation(efootballCategory?.id);

  const isLoading = isSettingsLoading || isCategoriesLoading || isRotationLoading;

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
