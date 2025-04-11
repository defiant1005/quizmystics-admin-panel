import axios from "axios";
import { useAuthStore } from "@/modules/auth/store";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router/routes";

export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use(
  function (config) {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      config.headers["Authorization"] = `Bearer ${authStore.accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  function (config) {
    return config;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore = useAuthStore();
      try {
        await authStore.refreshTokens();

        return API(originalRequest);
      } catch (refreshError) {
        const authStore = useAuthStore();
        const router = useRouter();

        await authStore.logout();
        await router.replace({ name: RouteNames.LOGIN_VIEW });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
