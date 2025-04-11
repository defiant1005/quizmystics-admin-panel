import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { IAdmin } from "@/modules/admins/types";
import { apiGetAdmins } from "@/modules/admins/api";

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
  },
});
