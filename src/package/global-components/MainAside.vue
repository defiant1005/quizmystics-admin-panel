<script lang="ts" setup>
import { RouteNames } from "@/router/routes";

defineOptions({
  name: "MainAside",
});
</script>

<template>
  <ElAside width="200px" class="main-aside">
    <ElScrollbar>
      <ElMenu>
        <ElMenuItem>
          <RouterLink
            :to="{ name: RouteNames.ADMINS_VIEW }"
            active-class="active-link"
          >
            Админы
          </RouterLink>
        </ElMenuItem>

        <ElMenuItem>
          <RouterLink
            :to="{ name: RouteNames.CATEGORY_VIEW }"
            active-class="active-link"
          >
            Категории
          </RouterLink>
        </ElMenuItem>

        <ElMenuItem>
          <RouterLink
            :to="{ name: RouteNames.QUESTION_VIEW }"
            active-class="active-link"
          >
            Вопросы
          </RouterLink>
        </ElMenuItem>
      </ElMenu>
    </ElScrollbar>
  </ElAside>
</template>

<style lang="scss" scoped>
.main-aside {
  height: 100%;
  user-select: none;
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);

  .el-menu {
    border-right: none;

    .el-menu-item {
      > a {
        width: 100%;
        height: 100%;
        color: rgb(166.2, 168.6, 173.4);
      }

      .active-link {
        color: rgb(133.4, 206.2, 97.4);
      }
    }
  }
}
</style>
