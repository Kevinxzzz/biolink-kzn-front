"use client";

import { Input } from "@/components/ui/Input";
import { SubTitleDashboard } from "@/components/layout/DashboardLayout";
import styles from "./ProfileSection.module.scss";

interface UserProfileData {
  name?: string;
  email?: string;
  role?: string;
}

interface ProfileSectionProps {
  userProfile?: UserProfileData | null;
}

export function ProfileSection({ userProfile }: ProfileSectionProps) {
  return (
    <section className={styles.section}>
      <SubTitleDashboard
        subtitle="Seu Perfil"
        description="Suas informações pessoais de acesso."
      />

      <div className={styles.sectionContent}>
        <div className={styles.formGrid}>
          <Input
            id="profile-name"
            name="name"
            label="Seu Nome"
            value={userProfile?.name || ""}
            onChange={() => {}}
            disabled
          />
          <Input
            id="profile-email"
            name="email"
            label="Seu Email"
            value={userProfile?.email || ""}
            onChange={() => {}}
            disabled
          />
        </div>
        <div>
          <span className={styles.intervalText}>Nível de Acesso</span>
          <span className={styles.roleBadge}>{userProfile?.role}</span>
        </div>
      </div>
    </section>
  );
}
