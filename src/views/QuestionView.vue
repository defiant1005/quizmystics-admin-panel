<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import { useQuestionStore } from "@/modules/question/store";
import CreateQuestionModal from "@/modules/question/components/CreateQuestionModal.vue";
import { useCategoryStore } from "@/modules/category/store";

defineOptions({
  name: "QuestionView",
});

const questionStore = useQuestionStore();
const categoryStore = useCategoryStore();

const questionsList = computed(() => questionStore.questionsList);

const isLoading = ref(false);
const isQuestionMutationDataModal = ref(false);
const isEditLoading = ref(false);
const isDeleteDisabled = ref(false);

const questionId = ref<null | number>(null);

const handleEdit = async (_questionId: number) => {
  questionId.value = _questionId;

  try {
    isEditLoading.value = true;
    await questionStore.getQuestionById(_questionId);
    isQuestionMutationDataModal.value = true;
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

const handleDelete = async (_questionId: number) => {
  try {
    isDeleteDisabled.value = true;
    await questionStore.removeQuestion(_questionId);
    await questionStore.getQuestions();
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
    questionId.value = null;
    questionStore.removeCurrentQuestion();
  }
};

onMounted(async () => {
  if (questionStore.isQuestionsEmpty) {
    try {
      isLoading.value = true;
      await questionStore.getQuestions();
    } finally {
      isLoading.value = false;
    }
  }

  if (categoryStore.isCategoriesEmpty) {
    await categoryStore.getCategories();
  }
});
</script>

<template>
  <ElScrollbar>
    <ElTable v-loading="isLoading" :data="questionsList" border>
      <ElTableColumn prop="id" label="ID" width="140" />

      <ElTableColumn prop="title" label="Заголовок" />

      <ElTableColumn label="Operations">
        <template #header>
          <ElButton @click="isQuestionMutationDataModal = true">
            Создать вопрос
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

    <CreateQuestionModal
      v-model="isQuestionMutationDataModal"
      :question-id="questionId"
      @update:modelValue="closeHandler"
    />
  </ElScrollbar>
</template>
