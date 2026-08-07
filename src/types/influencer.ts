export interface InfluencerPlatform {
  id: string;
  name: string;
  url: string;
}

export interface Influencer {
  id: string;
  name: string;
  slug?: string;
  email: string;
  avatarUrl?: string;
  platforms: InfluencerPlatform[];
  clicks: number;
  status: "ACTIVE" | "INACTIVE";
}
