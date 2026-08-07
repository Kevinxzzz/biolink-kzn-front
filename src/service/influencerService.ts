import type { Influencer, InfluencerPlatform } from "@/types/influencer";
import { MOCK_INFLUENCERS, MOCK_INFLUENCER_DELAY } from "./mocks/influencerMocks";
import { generateSlug } from "@/utils/slug";

const influencersDb = [...MOCK_INFLUENCERS];

const delay = () => new Promise((res) => setTimeout(res, MOCK_INFLUENCER_DELAY));

export const influencerService = {
  async getInfluencers(): Promise<Influencer[]> {
    await delay();
    return [...influencersDb];
  },

  async createInfluencer(
    data: Omit<Influencer, "id" | "clicks" | "status"> & { password?: string }
  ): Promise<Influencer> {
    await delay();
    const newInfluencer: Influencer = {
      name: data.name,
      slug: generateSlug(data.name),
      email: data.email,
      avatarUrl: data.avatarUrl,
      platforms: data.platforms || [],
      id: `inf_${Date.now()}`,
      clicks: 0,
      status: "ACTIVE",
    };
    influencersDb.push(newInfluencer);
    return newInfluencer;
  },

  async updateInfluencer(
    id: string,
    data: Partial<Omit<Influencer, "id" | "clicks" | "email">>
  ): Promise<Influencer> {
    await delay();
    const idx = influencersDb.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Influencer not found");
    influencersDb[idx] = { ...influencersDb[idx], ...data };
    return influencersDb[idx];
  },

  async updateInfluencerStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<Influencer> {
    return this.updateInfluencer(id, { status });
  },

  async updatePlatforms(id: string, platforms: InfluencerPlatform[]): Promise<Influencer> {
    return this.updateInfluencer(id, { platforms });
  },
};
