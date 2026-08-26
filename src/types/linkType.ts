export interface Link {
  id: string;
  title: string;
  url: string;
  countClicks: number;
  active: boolean;
  order: number;
  inRotationPool: boolean;
}

export interface ScheduledChange {
  id: string;
  linkId: string;
  scheduledAt: string;
}

export interface RotationSettings {
  isActive: boolean;
  intervalMinutes: number;
}
