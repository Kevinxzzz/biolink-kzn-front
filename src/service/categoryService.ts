import type { Category, CategoryRotation, UpdateCategoryRotationPayload } from "@/types/categoryType";
import { httpClient } from "./httpClient";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await httpClient.get<{ data: Category[] }>("/categories");
    return response.data.data;
  },
  
  async getCategoryRotation(categoryId: string): Promise<CategoryRotation> {
    const response = await httpClient.get<{ data: CategoryRotation }>(`/categories/${categoryId}/rotation`);
    return response.data.data;
  },

  async updateCategoryRotation(categoryId: string, data: UpdateCategoryRotationPayload): Promise<CategoryRotation> {
    const response = await httpClient.patch<{ data: CategoryRotation }>(`/categories/${categoryId}/rotation`, data);
    return response.data.data;
  }
};
