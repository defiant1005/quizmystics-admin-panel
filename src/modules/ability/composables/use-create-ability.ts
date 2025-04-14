import { computed, reactive, unref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { IAbilityForm } from "@/modules/ability/types";

export function useCreateAbility() {
  const createAbilityForm = reactive<IAbilityForm>({
    title: "",
    description: "",
    slug: "",
  });

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    description: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    slug: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
  }));

  const v$ = useVuelidate(rules, createAbilityForm);

  const titleError = computed(() =>
    unref(v$.value.title?.$errors[0]?.$message ?? "")
  );

  const descriptionError = computed(() =>
    unref(v$.value.description?.$errors[0]?.$message ?? "")
  );

  const slugError = computed(() =>
    unref(v$.value.slug?.$errors[0]?.$message ?? "")
  );

  const runValidate = async () => {
    await v$.value.$validate();
  };

  const clearErrors = () => {
    v$.value.$reset();
  };

  const isError = computed(() => v$.value.$error);

  const resetForm = () => {
    createAbilityForm.title = "";
    createAbilityForm.slug = "";
    createAbilityForm.description = "";
    clearErrors();
  };

  return {
    createAbilityForm,
    titleError,
    slugError,
    descriptionError,
    runValidate,
    isError,
    resetForm,
  };
}
