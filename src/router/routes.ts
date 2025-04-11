import { RouteRecordRaw } from "vue-router";
import LoginLayout from "@/layouts/LoginLayout.vue";

export enum RouteNames {
  LOGIN_LAYOUT = "LoginLayout",
  LOGIN_VIEW = "LoginView",
  MAIN_LAYOUT = "MainLayout",
  ADMINS_VIEW = "AdminsView",
  NOT_FOUND = "NotFound",
}

export const RoutePaths: Record<RouteNames, string> = {
  [RouteNames.LOGIN_LAYOUT]: "/login",
  [RouteNames.LOGIN_VIEW]: "",
  [RouteNames.MAIN_LAYOUT]: "/",
  [RouteNames.ADMINS_VIEW]: "",
  [RouteNames.NOT_FOUND]: "/:pathMatch(.*)*",
};

export const routes: RouteRecordRaw[] = [
  {
    path: RoutePaths.LoginLayout,
    name: RouteNames.LOGIN_LAYOUT,
    component: LoginLayout,
    children: [
      {
        path: RoutePaths.LoginView,
        name: RouteNames.LOGIN_VIEW,
        component: () => import("@/views/LoginPage.vue"),
        meta: {
          isAuthPage: true,
        },
      },
    ],
  },
  {
    path: RoutePaths.MainLayout,
    name: RouteNames.MAIN_LAYOUT,
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: RoutePaths.AdminsView,
        name: RouteNames.ADMINS_VIEW,
        component: () => import("@/views/AdminsView.vue"),
      },
    ],
  },
  {
    path: RoutePaths.NotFound,
    name: RouteNames.NOT_FOUND,
    component: () => import("@/views/NotFoundPage.vue"),
  },
];
