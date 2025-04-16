import { RouteRecordRaw } from "vue-router";
import LoginLayout from "@/layouts/LoginLayout.vue";

export enum RouteNames {
  LOGIN_LAYOUT = "LoginLayout",
  MAIN_LAYOUT = "MainLayout",

  LOGIN_VIEW = "LoginView",
  ADMINS_VIEW = "AdminsView",
  CATEGORY_VIEW = "CategoryView",
  QUESTION_VIEW = "QuestionView",
  ABILITY_VIEW = "AbilityView",
  CHARACTER_CLASS_VIEW = "CharacterClassView",

  NOT_FOUND = "NotFound",
}

export const RoutePaths: Record<RouteNames, string> = {
  [RouteNames.LOGIN_LAYOUT]: "/login",
  [RouteNames.MAIN_LAYOUT]: "/",

  [RouteNames.LOGIN_VIEW]: "",

  [RouteNames.ADMINS_VIEW]: "/admins",
  [RouteNames.CATEGORY_VIEW]: "/categories",
  [RouteNames.QUESTION_VIEW]: "/question",
  [RouteNames.ABILITY_VIEW]: "/ability",
  [RouteNames.CHARACTER_CLASS_VIEW]: "/character-class",

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
    redirect: {
      name: RouteNames.ADMINS_VIEW,
    },
    children: [
      {
        path: RoutePaths.AdminsView,
        name: RouteNames.ADMINS_VIEW,
        component: () => import("@/views/AdminsView.vue"),
      },
      {
        path: RoutePaths.CategoryView,
        name: RouteNames.CATEGORY_VIEW,
        component: () => import("@/views/CategoryView.vue"),
      },
      {
        path: RoutePaths.QuestionView,
        name: RouteNames.QUESTION_VIEW,
        component: () => import("@/views/QuestionView.vue"),
      },
      {
        path: RoutePaths.AbilityView,
        name: RouteNames.ABILITY_VIEW,
        component: () => import("@/views/AbilityView.vue"),
      },
      {
        path: RoutePaths.CharacterClassView,
        name: RouteNames.CHARACTER_CLASS_VIEW,
        component: () => import("@/views/CharacterClassView.vue"),
      },
    ],
  },
  {
    path: RoutePaths.NotFound,
    name: RouteNames.NOT_FOUND,
    component: () => import("@/views/NotFoundPage.vue"),
  },
];
