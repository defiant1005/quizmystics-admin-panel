<script lang="ts" setup>
import { useCreateCategory } from "@/modules/category/composables/use-create-category";
import { computed, PropType, ref, watch } from "vue";
import { ElNotification } from "element-plus";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { useCategoryStore } from "@/modules/category/store";
import { ICategory } from "@/modules/category/types";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  categoryId: {
    type: [Number, null] as PropType<number | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

defineOptions({
  name: "CreateCategoryModal",
});

const _modelValue = computed({
  get: () => props.modelValue,

  set: (value) => emit("update:modelValue", value),
});

const categoryStore = useCategoryStore();

const currentCategory = computed<ICategory | null>(
  () => categoryStore.currentCategory
);

const { createCategoryForm, titleError, runValidate, isError, resetForm } =
  useCreateCategory();

const closeModal = () => {
  _modelValue.value = false;

  resetForm();
};

const isEdit = computed(() => props.categoryId !== null);

const isLoading = ref(false);

const editCategorySubmit = async () => {
  if (!isEdit.value) {
    return;
  }

  try {
    isLoading.value = true;
    await categoryStore.editCategory(props.categoryId!, createCategoryForm);
    await categoryStore.getCategories();

    ElNotification({
      title: "Успешно",
      message: "Категория отредактирована",
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

const createCategorySubmit = async () => {
  try {
    isLoading.value = true;
    await categoryStore.createCategory(createCategoryForm);
    await categoryStore.getCategories();

    ElNotification({
      title: "Успешно",
      message: "Категория создана",
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

const submitForm = async () => {
  await runValidate();

  if (isError.value) {
    return;
  }

  if (isEdit.value) {
    await editCategorySubmit();
    return;
  }

  await createCategorySubmit();
};

const setDefaultData = () => {
  if (currentCategory.value === null) {
    return;
  }

  createCategoryForm.title = currentCategory.value.title;
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && isEdit.value) {
      setDefaultData();
    }
  }
);
</script>

<template>
  <ElDialog
    v-model="_modelValue"
    :title="isEdit ? 'Редактирование категории' : 'Создание категории'"
    width="500"
  >
    <ElForm :model="createCategoryForm" @submit.prevent="submitForm">
      <ElFormItem label-position="top" label="Title">
        <ElInput
          v-model="createCategoryForm.title"
          placeholder="Title"
          name="title"
          size="large"
        />

        <p v-if="titleError" class="error-message">{{ titleError }}</p>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeModal">Отмена</ElButton>

        <ElButton type="primary" :disabled="isLoading" @click="submitForm">
          Сохранить
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
