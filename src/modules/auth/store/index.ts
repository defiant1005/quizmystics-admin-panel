import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { apiLogin, apiLogout } from "@/modules/auth/api";
import { ILoginParams, ILogoutParams } from "@/modules/auth/types";
import { useCookies } from "@vueuse/integrations/useCookies";
const cookies = useCookies();

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    accessToken: cookies.get("access_token") as null | string,
    refreshToken: cookies.get("refresh_token") as null | string,
  }),

  getters: {
    isAuthenticated(): boolean {
      return Boolean(this.accessToken);
    },
  },

  actions: {
    async login(params: ILoginParams) {
      try {
        const response = await apiLogin(params);
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;

        cookies.set("access_token", accessToken);
        cookies.set("refresh_token", refreshToken);

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async logout() {
      if (!this.refreshToken) {
        return;
      }

      try {
        const params: ILogoutParams = {
          refreshToken: this.refreshToken,
        };
        await apiLogout(params);

        cookies.remove("access_token");
        cookies.remove("refresh_token");

        this.accessToken = null;
        this.refreshToken = null;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },
  },
});
