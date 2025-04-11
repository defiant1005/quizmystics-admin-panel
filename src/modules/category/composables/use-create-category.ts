import { computed, reactive, unref } from "vue";
import { ICategoryForm } from "@/modules/category/types";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export function useCreateCategory() {
  const createCategoryForm = reactive<ICategoryForm>({
    title: "",
  });

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
  }));

  const v$ = useVuelidate(rules, createCategoryForm);

  const titleError = computed(() =>
    unref(v$.value.title?.$errors[0]?.$message ?? "")
  );

  const runValidate = async () => {
    await v$.value.$validate();
  };

  const clearErrors = () => {
    v$.value.$reset();
  };

  const isError = computed(() => v$.value.$error);

  const resetForm = () => {
    createCategoryForm.title = "";
    clearErrors();
  };

  return {
    createCategoryForm,
    titleError,
    runValidate,
    isError,
    resetForm,
  };
}
