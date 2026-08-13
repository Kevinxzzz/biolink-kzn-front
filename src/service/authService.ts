import type { LoginCredentials, LoginResponse } from "@/types/authType";
import { httpClient, getErrorMessage } from "./httpClient";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await httpClient.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
