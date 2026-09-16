import type { Influencer } from "@/types/influencerType";
import { httpClient } from "./httpClient";

export type CreateInfluencerData = Omit<Influencer, "id" | "counterEntries" | "imgKey" | "personalUrl">;
export type UpdateInfluencerData = Partial<CreateInfluencerData>;

export const influencerService = {
  async getInfluencers(): Promise<Influencer[]> {
    const response = await httpClient.get<{ data: Influencer[] }>("/influencers");
    return response.data.data;
  },

  async getInfluencerById(id: string): Promise<Influencer> {
    const response = await httpClient.get<{ data: Influencer }>(`/influencers/${id}`);
    return response.data.data;
  },

  async createInfluencer(data: CreateInfluencerData): Promise<Influencer> {
    const response = await httpClient.post<{ data: Influencer }>("/influencers", data);
    return response.data.data;
  },

  async updateInfluencer(id: string, data: UpdateInfluencerData): Promise<Influencer> {
    const response = await httpClient.put<{ data: Influencer }>(`/influencers/${id}`, data);
    return response.data.data;
  },

  async deleteInfluencer(id: string): Promise<void> {
    await httpClient.delete(`/influencers/${id}`);
  }
};
