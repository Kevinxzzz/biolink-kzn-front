import type { Category } from "@/types/categoryType";
import { httpClient } from "./httpClient";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await httpClient.get<{ data: Category[] }>("/categories");
    return response.data.data;
  }
};
