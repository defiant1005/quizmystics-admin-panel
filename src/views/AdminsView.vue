<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAdminStore } from "@/modules/admins/store";
import { translateRole } from "@/modules/admins/helpers/translate-role";
import CreateAdminModal from "@/modules/admins/components/CreateAdminModal.vue";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";

defineComponent({
  name: "AdminsView",
});

const adminStore = useAdminStore();
const isAdminListEmpty = computed(() => adminStore.isAdminListEmpty);
const adminList = computed(() => adminStore.adminList);

const isLoading = ref(false);
const isEditLoading = ref(false);
const isDeleteDisabled = ref(false);

const handleDelete = async (adminId: number) => {
  try {
    isDeleteDisabled.value = true;
    await adminStore.deleteAdmin(adminId);
    await adminStore.getAdmins();
  } catch (e) {
    const errorMessage = errorHandler(e);

    ElNotification({
      title: "Что-то пошло не так",
      message: `${errorMessage}`,
      type: "error",
    });
  } finally {
    isDeleteDisabled.value = false;
  }
};

const handleEdit = async (_adminId: number) => {
  adminId.value = _adminId;

  try {
    isEditLoading.value = true;
    await adminStore.getAdminById(adminId.value);
    isAdminMutationDataModal.value = true;
  } catch (e) {
    const errorMessage = errorHandler(e);

    ElNotification({
      title: "Что-то пошло не так",
      message: `${errorMessage}`,
      type: "error",
    });
  } finally {
    isEditLoading.value = false;
  }
};

const isAdminMutationDataModal = ref(false);

const adminId = ref<null | number>(null);

const closeHandler = (modelValue: boolean) => {
  if (!modelValue) {
    adminId.value = null;
    adminStore.removeCurrentAdmin();
  }
};

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
          <ElButton @click="isAdminMutationDataModal = true">
            Создать админа
          </ElButton>
        </template>

        <template #default="scope">
          <ElButton
            size="small"
            :disabled="isEditLoading"
            @click="handleEdit(scope.row.id)"
          >
            Редактировать
          </ElButton>

          <ElButton
            size="small"
            :disabled="isDeleteDisabled"
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            Удалить
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <CreateAdminModal
      v-model="isAdminMutationDataModal"
      :admin-id="adminId"
      @update:modelValue="closeHandler"
    />
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
