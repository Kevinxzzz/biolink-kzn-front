import type { LoginResponse } from "@/types/auth";

export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token",
  user: {
    id: "usr_01",
    email: "admin@kzn.com",
    name: "Kevin Admin",
    enterpriseId: "ent_01",
    accountType: "USER",
    role: "OWNER",
  },
};

export const MOCK_LOGIN_DELAY = 1200;
