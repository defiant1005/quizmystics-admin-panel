import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { IAdmin, ICreateAdminParams } from "@/modules/admins/types";
import { apiCreateAdmin, apiGetAdmins } from "@/modules/admins/api";

export const useAdminStore = defineStore("admin-store", {
  state: () => ({
    admins: null as null | Array<IAdmin>,
  }),

  getters: {
    adminList(store) {
      return Array.isArray(store.admins) ? store.admins : [];
    },

    isAdminListEmpty(store) {
      return !Array.isArray(store.admins);
    },
  },

  actions: {
    async getAdmins() {
      try {
        const response = await apiGetAdmins();
        this.admins = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async createAdmins(params: ICreateAdminParams) {
      try {
        await apiCreateAdmin(params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },
  },
});
