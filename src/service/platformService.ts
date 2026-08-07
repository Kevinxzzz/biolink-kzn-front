import type { Platform } from "@/types/platform";
import { MOCK_PLATFORMS, MOCK_PLATFORM_DELAY } from "./mocks/platformMocks";

const delay = () => new Promise((res) => setTimeout(res, MOCK_PLATFORM_DELAY));

export const platformService = {
  async getPlatforms(): Promise<Platform[]> {
    await delay();
    return [...MOCK_PLATFORMS];
  },
};
