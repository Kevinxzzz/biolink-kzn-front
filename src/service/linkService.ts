import type { Link, ScheduledChange, RotationSettings } from "@/types/link";
import { MOCK_LINKS, MOCK_SCHEDULED_CHANGES, MOCK_ROTATION_SETTINGS, MOCK_LINK_DELAY } from "./mocks/linkMocks";

// Fake database instance for the session
let linksDb = [...MOCK_LINKS];
let scheduledChangesDb = [...MOCK_SCHEDULED_CHANGES];
let rotationSettingsDb = { ...MOCK_ROTATION_SETTINGS };

const delay = () => new Promise((res) => setTimeout(res, MOCK_LINK_DELAY));

export const linkService = {
  async getLinks(): Promise<Link[]> {
    await delay();
    return [...linksDb].sort((a, b) => a.order - b.order);
  },

  async createLink(data: Omit<Link, "id" | "clicks" | "order" | "isActive">): Promise<Link> {
    await delay();
    const newLink: Link = {
      ...data,
      id: `lnk_${Date.now()}`,
      clicks: 0,
      order: linksDb.length + 1,
      isActive: false,
    };
    linksDb.push(newLink);
    return newLink;
  },

  async updateLink(id: string, data: Partial<Omit<Link, "id" | "clicks" | "order" | "isActive">>): Promise<Link> {
    await delay();
    const idx = linksDb.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Link not found");
    linksDb[idx] = { ...linksDb[idx], ...data };
    return linksDb[idx];
  },

  async deleteLink(id: string): Promise<void> {
    await delay();
    linksDb = linksDb.filter((l) => l.id !== id);
  },

  async reorderLinks(newOrderIds: string[]): Promise<Link[]> {
    await delay();
    const orderMap = new Map(newOrderIds.map((id, index) => [id, index + 1]));
    linksDb = linksDb.map((link) => ({
      ...link,
      order: orderMap.get(link.id) ?? link.order,
    }));
    return this.getLinks();
  },

  async getRotationSettings(): Promise<RotationSettings> {
    await delay();
    return { ...rotationSettingsDb };
  },

  async updateRotationSettings(data: Partial<RotationSettings>): Promise<RotationSettings> {
    await delay();
    rotationSettingsDb = { ...rotationSettingsDb, ...data };
    return { ...rotationSettingsDb };
  },

  async getScheduledChanges(): Promise<ScheduledChange[]> {
    await delay();
    return [...scheduledChangesDb];
  },
  
  async createScheduledChange(linkId: string, scheduledAt: string): Promise<ScheduledChange> {
    await delay();
    const sc: ScheduledChange = { id: `sch_${Date.now()}`, linkId, scheduledAt };
    scheduledChangesDb.push(sc);
    return sc;
  },

  async deleteScheduledChange(id: string): Promise<void> {
    await delay();
    scheduledChangesDb = scheduledChangesDb.filter((s) => s.id !== id);
  }
};
