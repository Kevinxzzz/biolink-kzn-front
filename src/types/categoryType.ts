export type ToggleType = "MANUAL" | "LIMITCLICKS" | "TIMER" | "SCHEDULE";

export interface Category {
  id: string;
  name: string;
}

export interface CategoryRotation {
  id: string;
  toggleType: ToggleType;
  limitClicks: number | null;
  timerInMinutes: number | null;
  timerStartedAt: string | null;
  categoryId: string;
}

export interface UpdateCategoryRotationPayload {
  toggleType: ToggleType;
  limitClicks?: number | null;
  timerInMinutes?: number | null;
}

