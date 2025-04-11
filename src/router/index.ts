import { createRouter, createWebHistory, Router } from "vue-router";
import { RouteNames, routes } from "@/router/routes";
import { useAuthStore } from "@/modules/auth/store";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && !to.meta.isAuthPage) {
    return { name: RouteNames.LOGIN_VIEW };
  }

  if (authStore.isAuthenticated && to.meta.isAuthPage) {
    return { name: RouteNames.ADMINS_VIEW };
  }

  // @ts-ignore
  document.title = to.meta.title ?? window.document.title;
});

export default router;
