import type { Link, ScheduledChange, RotationSettings } from "@/types/linkType";
import { httpClient } from "./httpClient";

export const linkService = {
  async getLinks(): Promise<Link[]> {
    const response = await httpClient.get<{ data: Link[] }>("/links");
    return response.data.data;
  },

  async createLink(data: { title: string; url: string }): Promise<Link> {
    const response = await httpClient.post<{ data: Link }>("/links", data);
    return response.data.data;
  },

  async updateLink(id: string, data: { title?: string; url?: string }): Promise<Link> {
    const response = await httpClient.patch<{ data: Link }>(`/links/${id}`, data);
    return response.data.data;
  },

  async deleteLink(id: string): Promise<void> {
    await httpClient.delete(`/links/${id}`);
  },

  async activateLink(id: string): Promise<Link> {
    const response = await httpClient.patch<{ data: Link }>(`/links/${id}/activate`);
    return response.data.data;
  },

  async reorderLinks(newOrderIds: string[]): Promise<Link[]> {
    const orderPayload = newOrderIds.map((id, index) => ({
      id,
      order: index + 1,
    }));
    const response = await httpClient.patch<{ data: Link[] }>("/links/reorder", {
      links: orderPayload,
    });
    return response.data.data;
  },

  // TODO: The rotation logic is NOT part of this iteration according to plan.
  // Mocks retained here temporarily if needed by other components, but ideally will be refactored when rotation is done.
  async getRotationSettings(): Promise<RotationSettings> {
    return { isActive: false, intervalMinutes: 10 };
  },

  async updateRotationSettings(data: Partial<RotationSettings>): Promise<RotationSettings> {
    return { isActive: false, intervalMinutes: 10, ...data };
  },

  async getScheduledChanges(): Promise<ScheduledChange[]> {
    return [];
  },

  async createScheduledChange(linkId: string, scheduledAt: string): Promise<ScheduledChange> {
    return { id: "mock", linkId, scheduledAt };
  },

  async deleteScheduledChange(_id: string): Promise<void> {}
};
