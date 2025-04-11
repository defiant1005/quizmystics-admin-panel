<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAdminStore } from "@/modules/admins/store";
import { translateRole } from "@/modules/admins/helpers/translate-role";

defineComponent({
  name: "AdminsView",
});

const adminStore = useAdminStore();
const isAdminListEmpty = computed(() => adminStore.isAdminListEmpty);
const adminList = computed(() => adminStore.adminList);

const isLoading = ref(false);

onMounted(async () => {
  if (isAdminListEmpty.value) {
    try {
      isLoading.value = true;

      await adminStore.getAdmins();
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <ElScrollbar>
    <ElTable v-loading="isLoading" :data="adminList">
      <ElTableColumn prop="id" label="ID" width="140" />
      <ElTableColumn prop="email" label="Почта" />
      <ElTableColumn prop="role" label="Роль">
        <template #default="{ row }">
          {{ translateRole(row.role) }}
        </template>
      </ElTableColumn>
    </ElTable>
  </ElScrollbar>
</template>

<style lang="scss">
.posts-page {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
</style>
