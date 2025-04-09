<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { useAuthStore } from "@/modules/auth/store";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router/routes";

defineComponent({
  name: "MainLayout",
});

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);

const exit = async () => {
  isLoading.value = true;

  try {
    await authStore.logout();

    await router.replace({
      name: RouteNames.LOGIN_VIEW,
    });
  } catch (e) {
    const errorMessage = errorHandler(e);

    ElNotification({
      title: "Что-то пошло не так",
      message: `${errorMessage}`,
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="main-layout">
    <header>
      <ElButton :loading="isLoading" @click="exit">Выйти</ElButton>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  height: 100dvh;
  display: grid;
  grid-template-rows: min-content 1fr;

  > header {
    padding: 0 20px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: rgb(235, 180.6, 99);
  }

  > main {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
