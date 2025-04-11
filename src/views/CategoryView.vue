<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCategoryStore } from "@/modules/category/store";
import { onMounted } from "vue";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import CreateCategoryModal from "@/modules/category/components/CreateCategoryModal.vue";

defineOptions({
  name: "CategoryView",
});

const categoryStore = useCategoryStore();

const categoriesList = computed(() => categoryStore.categoriesList);

const isLoading = ref(false);
const isCategoryMutationDataModal = ref(false);
const isEditLoading = ref(false);
const isDeleteDisabled = ref(false);

const categoryId = ref<null | number>(null);

const handleEdit = async (_categoryId: number) => {
  categoryId.value = _categoryId;

  try {
    isEditLoading.value = true;
    await categoryStore.getCategoryById(_categoryId);
    isCategoryMutationDataModal.value = true;
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

const handleDelete = async (_categoryId: number) => {
  try {
    isDeleteDisabled.value = true;
    await categoryStore.removeCategory(_categoryId);
    await categoryStore.getCategories();
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

const closeHandler = (modelValue: boolean) => {
  if (!modelValue) {
    categoryId.value = null;
    categoryStore.removeCurrentCategory();
  }
};

onMounted(async () => {
  if (categoryStore.isCategoriesEmpty) {
    try {
      isLoading.value = true;
      await categoryStore.getCategories();
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <ElScrollbar>
    <ElTable v-loading="isLoading" :data="categoriesList" border>
      <ElTableColumn prop="id" label="ID" width="140" />

      <ElTableColumn prop="title" label="Заголовок" />

      <ElTableColumn label="Operations">
        <template #header>
          <ElButton @click="isCategoryMutationDataModal = true">
            Создать категорию
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

    <CreateCategoryModal
      v-model="isCategoryMutationDataModal"
      :category-id="categoryId"
      @update:modelValue="closeHandler"
    />
  </ElScrollbar>
</template>
