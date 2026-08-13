import type { Link, ScheduledChange, RotationSettings } from "@/types/linkType";

export const MOCK_LINKS: Link[] = [
  {
    id: "lnk_1",
    title: "Grupo WhatsApp",
    url: "https://chat.whatsapp.com/abc",
    clicks: 8421,
    order: 1,
    isActive: true, // Currently selected by rotation
    isEnabled: true,
    rotationPool: true,
  },
  {
    id: "lnk_2",
    title: "Comprar conta",
    url: "https://kzn.com/buy",
    clicks: 6832,
    order: 2,
    isActive: false,
    isEnabled: true,
    rotationPool: true,
  },
  {
    id: "lnk_3",
    title: "Instagram",
    url: "https://instagram.com/kzn",
    clicks: 4221,
    order: 3,
    isActive: false,
    isEnabled: true,
    rotationPool: false,
  },
  {
    id: "lnk_4",
    title: "Discord",
    url: "https://discord.gg/kzn",
    clicks: 1250,
    order: 4,
    isActive: false,
    isEnabled: false, // Turned off
    rotationPool: true,
  },
];

export const MOCK_SCHEDULED_CHANGES: ScheduledChange[] = [
  {
    id: "sch_1",
    linkId: "lnk_2", // Comprar conta
    scheduledAt: "2026-08-10T18:00:00Z",
  },
];

export const MOCK_ROTATION_SETTINGS: RotationSettings = {
  isActive: true,
  intervalMinutes: 1440, // 24 hours (1 day)
};

export const MOCK_LINK_DELAY = 500;
