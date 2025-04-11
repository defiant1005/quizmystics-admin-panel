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
          <RouterLink :to="{ name: RouteNames.ADMINS_VIEW }">Админы</RouterLink>
        </ElMenuItem>
      </ElMenu>
    </ElScrollbar>
  </ElAside>
</template>

<style lang="scss" scoped>
.main-aside {
  height: 100%;
  user-select: none;
}

.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  padding: 0;

  > a {
    width: 100%;
    height: 100%;
  }
}

.el-main {
  padding: 0;
}

.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
