<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAuthStore } from "@/modules/auth/store";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router/routes";
import MainAside from "@/package/global-components/MainAside.vue";
import { translateRole } from "@/modules/admins/helpers/translate-role";

defineComponent({
  name: "MainLayout",
});

const authStore = useAuthStore();

const router = useRouter();
const isWrapperLoading = ref(false);
const isLoading = ref(false);

const _meData = computed(() => authStore._meData);
const isMeEmpty = computed(() => authStore.isMeEmpty);

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

onMounted(async () => {
  if (authStore.isMeEmpty) {
    try {
      isWrapperLoading.value = true;
      await authStore.getMe();
    } finally {
      isWrapperLoading.value = false;
    }
  }
});
</script>

<template>
  <ElContainer v-loading="isWrapperLoading" class="main-layout">
    <ElHeader v-if="!isMeEmpty">
      <p>{{ _meData.email }}</p>
      <p>{{ translateRole(_meData.role) }}</p>
      <ElButton :loading="isLoading" @click="exit">Выйти</ElButton>
    </ElHeader>

    <ElContainer class="main-layout__container">
      <MainAside />

      <ElMain>
        <RouterView v-if="!isWrapperLoading" />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.main-layout {
  height: 100dvh;
  display: grid;
  grid-template-rows: min-content 1fr;

  .el-header {
    position: relative;

    padding: 0 20px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    background-color: var(--el-color-primary-light-7);
  }

  &__container {
    height: 100%;
    overflow-y: auto;
    padding: 0;

    .el-main {
      padding: 0;
    }
  }
}
</style>
