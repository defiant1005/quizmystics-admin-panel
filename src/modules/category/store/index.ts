import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import {
  apiCreateCategory,
  apiEditCategory,
  apiGetCategories,
  apiGetCategoryById,
  apiRemoveCategory,
} from "@/modules/category/api";
import { ICategory, ICategoryParams } from "@/modules/category/types";

export const useCategoryStore = defineStore("category-store", {
  state: () => ({
    categories: null as null | ICategory[],
    currentCategory: null as null | ICategory,
  }),

  getters: {
    categoriesList(store) {
      return Array.isArray(store.categories) ? store.categories : [];
    },

    isCategoriesEmpty(store) {
      return !Array.isArray(store.categories);
    },
  },

  actions: {
    async getCategories() {
      try {
        const response = await apiGetCategories();
        this.categories = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async getCategoryById(categoryId: number) {
      try {
        const response = await apiGetCategoryById(categoryId);
        this.currentCategory = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async createCategory(params: ICategoryParams) {
      try {
        await apiCreateCategory(params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async editCategory(categoryId: number, params: ICategoryParams) {
      try {
        await apiEditCategory(categoryId, params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async removeCategory(categoryId: number) {
      try {
        await apiRemoveCategory(categoryId);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    removeCurrentCategory() {
      this.currentCategory = null;
    },
  },
});
