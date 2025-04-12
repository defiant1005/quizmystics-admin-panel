import { computed, reactive, unref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { AnswerVariant, IQuestionForm } from "@/modules/question/types";

export function useCreateQuestion() {
  const createQuestionForm = reactive<IQuestionForm>({
    title: "",
    categoryId: "",
    [AnswerVariant.ANSWER1]: "",
    [AnswerVariant.ANSWER2]: "",
    [AnswerVariant.ANSWER3]: "",
    [AnswerVariant.ANSWER4]: "",
    correct_answer: "",
  });

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    categoryId: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    [AnswerVariant.ANSWER1]: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    [AnswerVariant.ANSWER2]: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    [AnswerVariant.ANSWER3]: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    [AnswerVariant.ANSWER4]: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    correct_answer: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
  }));

  const v$ = useVuelidate(rules, createQuestionForm);

  const titleError = computed(() =>
    unref(v$.value.title?.$errors[0]?.$message ?? "")
  );

  const categoryIdError = computed(() =>
    unref(v$.value.categoryId?.$errors[0]?.$message ?? "")
  );

  const answer1Error = computed(() =>
    unref(v$.value[AnswerVariant.ANSWER1]?.$errors[0]?.$message ?? "")
  );

  const answer2Error = computed(() =>
    unref(v$.value[AnswerVariant.ANSWER2]?.$errors[0]?.$message ?? "")
  );

  const answer3Error = computed(() =>
    unref(v$.value[AnswerVariant.ANSWER3]?.$errors[0]?.$message ?? "")
  );

  const answer4Error = computed(() =>
    unref(v$.value[AnswerVariant.ANSWER4]?.$errors[0]?.$message ?? "")
  );

  const correctAnswerError = computed(() =>
    unref(v$.value.correct_answer?.$errors[0]?.$message ?? "")
  );

  const runValidate = async () => {
    await v$.value.$validate();
  };

  const clearErrors = () => {
    v$.value.$reset();
  };

  const isError = computed(() => v$.value.$error);

  const resetForm = () => {
    createQuestionForm.title = "";
    createQuestionForm.categoryId = "";
    createQuestionForm.correct_answer = "";
    createQuestionForm[AnswerVariant.ANSWER1] = "";
    createQuestionForm[AnswerVariant.ANSWER2] = "";
    createQuestionForm[AnswerVariant.ANSWER3] = "";
    createQuestionForm[AnswerVariant.ANSWER4] = "";
    clearErrors();
  };

  return {
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
  };
}
