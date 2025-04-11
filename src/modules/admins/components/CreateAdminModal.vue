<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCreateAdmin } from "@/modules/admins/composables/use-create-admin";
import { AdminRole } from "@/modules/admins/types";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import { useAdminStore } from "@/modules/admins/store";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const _modelValue = computed({
  get: () => props.modelValue,

  set: (value) => emit("update:modelValue", value),
});

defineOptions({
  name: "CreateAdminModal",
});

const adminStore = useAdminStore();

const {
  createAdminForm,
  emailError,
  passwordError,
  roleError,
  runValidate,
  isError,
  resetForm,
} = useCreateAdmin();

const closeModal = () => {
  _modelValue.value = false;

  resetForm();
};

const isLoading = ref(false);

const submitForm = async () => {
  runValidate();

  if (isError.value) {
    return;
  }

  try {
    isLoading.value = true;
    await adminStore.createAdmins(createAdminForm);
    await adminStore.getAdmins();

    ElNotification({
      title: "Успешно",
      message: "Админ создан",
      type: "success",
    });

    closeModal();
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
  <ElDialog v-model="_modelValue" title="Создание админа" width="500">
    <ElForm :model="createAdminForm" @submit.prevent="submitForm">
      <ElFormItem label-position="top" label="Email">
        <ElInput
          v-model="createAdminForm.email"
          type="email"
          placeholder="Email"
          name="email"
          size="large"
        />

        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </ElFormItem>

      <ElFormItem label="Пароль" label-position="top">
        <ElInput
          v-model="createAdminForm.password"
          type="password"
          placeholder="Пароль"
          show-password
          name="password"
          size="large"
        />

        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </ElFormItem>

      <ElFormItem label="Роль" label-position="top">
        <ElSelect
          v-model="createAdminForm.role"
          placeholder="Выберите роль"
          size="large"
        >
          <ElOption label="Супер Админ" :value="AdminRole.SUPER_ADMIN" />
          <ElOption label="Админ" :value="AdminRole.ADMIN" />
        </ElSelect>

        <p v-if="roleError" class="error-message">{{ roleError }}</p>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeModal">Отмена</ElButton>

        <ElButton type="primary" :disabled="isLoading" @click="submitForm">
          Создать
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.create-admin-modal {
}
</style>
