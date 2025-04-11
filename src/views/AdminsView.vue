<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAdminStore } from "@/modules/admins/store";
import { translateRole } from "@/modules/admins/helpers/translate-role";
import CreateAdminModal from "@/modules/admins/components/CreateAdminModal.vue";

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

const handleDelete = (index: number, row: any) => {
  console.log("Edit admin", index, row);
};

const handleEdit = (index: number, row: any) => {
  console.log("Edit admin", index, row);
};

const isCreateAdminModal = ref(false);
</script>

<template>
  <ElScrollbar>
    <ElTable v-loading="isLoading" :data="adminList" border>
      <ElTableColumn prop="id" label="ID" width="140" />

      <ElTableColumn prop="email" label="Почта" />

      <ElTableColumn prop="role" label="Роль">
        <template #default="{ row }">
          {{ translateRole(row.role) }}
        </template>
      </ElTableColumn>

      <ElTableColumn label="Operations">
        <template #header>
          <ElButton @click="isCreateAdminModal = true">Создать админа</ElButton>
        </template>

        <template #default="scope">
          <ElButton size="small" @click="handleEdit(scope.$index, scope.row)">
            Редактировать
          </ElButton>

          <ElButton
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            Удалить
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <CreateAdminModal v-model="isCreateAdminModal" />
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
