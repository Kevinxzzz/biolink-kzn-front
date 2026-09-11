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
  },

  async getGlobalRotation(): Promise<CategoryRotation> {
    const response = await httpClient.get<{ data: CategoryRotation }>("/categories/rotation");
    return response.data.data;
  },

  async updateGlobalRotation(data: UpdateCategoryRotationPayload): Promise<CategoryRotation> {
    const response = await httpClient.patch<{ data: CategoryRotation }>("/categories/rotation", data);
    return response.data.data;
  },

  async getPublicCategories(): Promise<Category[]> {
    const response = await httpClient.get<{ data: Category[] }>("/categories/public");
    return response.data.data;
  },

  async createCategory(data: { name: string }): Promise<Category> {
    const response = await httpClient.post<{ data: Category }>("/categories", data);
    return response.data.data;
  },

  async updateCategory(id: string, data: { name: string }): Promise<Category> {
    const response = await httpClient.patch<{ data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await httpClient.delete(`/categories/${id}`);
  }
};
