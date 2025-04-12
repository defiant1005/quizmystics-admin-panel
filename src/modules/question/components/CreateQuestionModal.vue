<script lang="ts" setup>
import { computed, PropType, ref, watch } from "vue";
import { ElNotification } from "element-plus";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { useQuestionStore } from "@/modules/question/store";
import { AnswerVariant, IQuestion } from "@/modules/question/types";
import { useCreateQuestion } from "@/modules/question/composables/use-create-question";
import { useCategoryStore } from "@/modules/category/store";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  questionId: {
    type: [Number, null] as PropType<number | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

defineOptions({
  name: "CreateQuestionModal",
});

const _modelValue = computed({
  get: () => props.modelValue,

  set: (value) => emit("update:modelValue", value),
});

const questionStore = useQuestionStore();
const categoryStore = useCategoryStore();

const categoryList = computed(() => categoryStore.categoriesList);

const currentQuestion = computed<IQuestion | null>(
  () => questionStore.currentQuestion
);

const {
  createQuestionForm,
  titleError,
  categoryIdError,
  answer1Error,
  answer2Error,
  answer3Error,
  answer4Error,
  correctAnswerError,
  runValidate,
  isError,
  resetForm,
} = useCreateQuestion();

const closeModal = () => {
  _modelValue.value = false;

  resetForm();
};

const isEdit = computed(() => props.questionId !== null);

const isLoading = ref(false);

const editQuestionSubmit = async () => {
  if (!isEdit.value) {
    return;
  }

  try {
    isLoading.value = true;
    await questionStore.editQuestion(props.questionId!, createQuestionForm);
    await questionStore.getQuestions();

    ElNotification({
      title: "Успешно",
      message: "Вопрос отредактирован",
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

const createQuestionSubmit = async () => {
  try {
    isLoading.value = true;
    await questionStore.createQuestion(createQuestionForm);
    await questionStore.getQuestions();

    ElNotification({
      title: "Успешно",
      message: "Вопрос создан",
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
    await editQuestionSubmit();
    return;
  }

  await createQuestionSubmit();
};

const setDefaultData = () => {
  if (currentQuestion.value === null) {
    return;
  }

  createQuestionForm.title = currentQuestion.value.title;
  createQuestionForm.categoryId = currentQuestion.value.categoryId;
  createQuestionForm[AnswerVariant.ANSWER1] =
    currentQuestion.value[AnswerVariant.ANSWER1];
  createQuestionForm[AnswerVariant.ANSWER2] =
    currentQuestion.value[AnswerVariant.ANSWER2];
  createQuestionForm[AnswerVariant.ANSWER3] =
    currentQuestion.value[AnswerVariant.ANSWER3];
  createQuestionForm[AnswerVariant.ANSWER4] =
    currentQuestion.value[AnswerVariant.ANSWER4];

  createQuestionForm.correct_answer = currentQuestion.value.correct_answer;
};

const isCorrectDisabled = computed(
  () =>
    createQuestionForm[AnswerVariant.ANSWER1] === "" ||
    createQuestionForm[AnswerVariant.ANSWER2] === "" ||
    createQuestionForm[AnswerVariant.ANSWER3] === "" ||
    createQuestionForm[AnswerVariant.ANSWER4] === ""
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && isEdit.value) {
      setDefaultData();
    }

    if (!newValue) {
      resetForm();
    }
  }
);
</script>

<template>
  <ElDialog
    v-model="_modelValue"
    :title="isEdit ? 'Редактирование вопроса' : 'Создание вопроса'"
    width="500"
  >
    <ElForm :model="createQuestionForm" @submit.prevent="submitForm">
      <ElFormItem label-position="top" label="Категория">
        <ElSelect
          v-model="createQuestionForm.categoryId"
          placeholder="Выберите категорию"
          size="large"
        >
          <ElOption
            v-for="category in categoryList"
            :key="category.id"
            :label="category.title"
            :value="category.id"
          />
        </ElSelect>

        <p v-if="categoryIdError" class="error-message">
          {{ categoryIdError }}
        </p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Заголовок">
        <ElInput
          v-model="createQuestionForm.title"
          placeholder="Заголовок"
          size="large"
        />

        <p v-if="titleError" class="error-message">{{ titleError }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Ответ1">
        <ElInput
          v-model="createQuestionForm[AnswerVariant.ANSWER1]"
          placeholder="Ответ1"
          size="large"
        />

        <p v-if="answer1Error" class="error-message">{{ answer1Error }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Ответ2">
        <ElInput
          v-model="createQuestionForm[AnswerVariant.ANSWER2]"
          placeholder="Ответ2"
          size="large"
        />

        <p v-if="answer2Error" class="error-message">{{ answer2Error }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Ответ3">
        <ElInput
          v-model="createQuestionForm[AnswerVariant.ANSWER3]"
          placeholder="Ответ3"
          size="large"
        />

        <p v-if="answer3Error" class="error-message">{{ answer3Error }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Ответ4">
        <ElInput
          v-model="createQuestionForm[AnswerVariant.ANSWER4]"
          placeholder="Ответ4"
          size="large"
        />

        <p v-if="answer4Error" class="error-message">{{ answer4Error }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Правильный ответ">
        <ElSelect
          v-model="createQuestionForm.correct_answer"
          :disabled="isCorrectDisabled"
          placeholder="Выберите правиьный ответ"
          size="large"
        >
          <ElOption
            :label="createQuestionForm[AnswerVariant.ANSWER1]"
            :value="AnswerVariant.ANSWER1"
          />

          <ElOption
            :label="createQuestionForm[AnswerVariant.ANSWER2]"
            :value="AnswerVariant.ANSWER2"
          />

          <ElOption
            :label="createQuestionForm[AnswerVariant.ANSWER3]"
            :value="AnswerVariant.ANSWER3"
          />

          <ElOption
            :label="createQuestionForm[AnswerVariant.ANSWER4]"
            :value="AnswerVariant.ANSWER4"
          />
        </ElSelect>

        <p v-if="correctAnswerError" class="error-message">
          {{ correctAnswerError }}
        </p>
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
