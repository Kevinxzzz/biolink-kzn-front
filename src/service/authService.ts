import type { LoginCredentials, LoginResponse, AuthenticatedUser } from "@/types/authType";
import { httpClient, getErrorMessage } from "./httpClient";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await httpClient.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getMe(): Promise<AuthenticatedUser> {
  try {
    // A rota retorna 200 se o token e aplicação estão válidos.
    const response = await httpClient.get<AuthenticatedUser>("/auth/me");
    return response.data;
  } catch (error) {
    // Note: 401 e 403 já são lançados como ApiError e tratados acima, 
    // ou podem ser capturados pelo hook. Apenas repassamos o erro.
    throw error;
  }
}

/**
 * Encerra a sessão no servidor, removendo o cookie de autenticação (kzn_auth_token).
 * Deve ser chamado junto com a limpeza local do token no localStorage.
 * Ignora erros silenciosamente para não bloquear o fluxo de logout local.
 */
export async function logout(): Promise<void> {
  try {
    await httpClient.post("/auth/logout");
  } catch {
    // Ignora erros de rede: o logout local deve sempre prosseguir.
  }
}
