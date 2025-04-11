import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { IAdmin, ICreateAdminParams } from "@/modules/admins/types";
import {
  apiCreateAdmin,
  apiDeleteAdmin,
  apiEditAdmin,
  apiGetAdminById,
  apiGetAdmins,
} from "@/modules/admins/api";

export const useAdminStore = defineStore("admin-store", {
  state: () => ({
    admins: null as null | Array<IAdmin>,
    currentAdmin: null as null | IAdmin,
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

    async getAdminById(adminId: number) {
      try {
        const response = await apiGetAdminById(adminId);
        this.currentAdmin = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    removeCurrentAdmin() {
      this.currentAdmin = null;
    },

    async createAdmins(params: ICreateAdminParams) {
      try {
        await apiCreateAdmin(params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async editAdmin(adminId: number, params: ICreateAdminParams) {
      try {
        await apiEditAdmin(adminId, params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async deleteAdmin(adminId: number) {
      try {
        await apiDeleteAdmin(adminId);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },
  },
});
