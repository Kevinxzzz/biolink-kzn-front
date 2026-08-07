import type { Influencer } from "@/types/influencer";

export const MOCK_INFLUENCERS: Influencer[] = [
  {
    id: "inf_1",
    name: "João Silva",
    slug: "joao-silva",
    email: "joao@example.com",
    clicks: 5421,
    status: "ACTIVE",
    platforms: [
      { id: "plat_1", name: "Instagram", url: "https://instagram.com/joaosilva" },
      { id: "plat_2", name: "TikTok", url: "https://tiktok.com/@joaosilva" },
    ],
  },
  {
    id: "inf_2",
    name: "Maria Lima",
    slug: "maria-lima",
    email: "maria@example.com",
    clicks: 3892,
    status: "ACTIVE",
    platforms: [
      { id: "plat_3", name: "YouTube", url: "https://youtube.com/marialima" },
    ],
  },
  {
    id: "inf_3",
    name: "Pedro E-sports",
    email: "pedro@example.com",
    clicks: 2104,
    status: "INACTIVE",
    platforms: [
      { id: "plat_4", name: "Twitch", url: "https://twitch.tv/pedro_esports" },
    ],
  },
];

export const MOCK_INFLUENCER_DELAY = 500;
