import type { LoginCredentials, LoginResponse } from "@/types/auth";
import { MOCK_LOGIN_RESPONSE, MOCK_LOGIN_DELAY } from "./mocks/authMocks";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // TODO: Substituir por chamada real à API
  // return fetch("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) })
  await new Promise((resolve) => setTimeout(resolve, MOCK_LOGIN_DELAY));

  if (credentials.email === "admin@kzn.com" && credentials.password === "123456") {
    return MOCK_LOGIN_RESPONSE;
  }

  throw new Error("Credenciais inválidas. Verifique seu email e senha.");
}
