import { reactive, computed, unref } from "vue";
import { ILoginForm } from "@/modules/auth/types";
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";

export function useLoginForm() {
  const loginForm = reactive<ILoginForm>({
    email: "",
    password: "",
  });

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage("Поле не может быть пустым", required),
      email: helpers.withMessage("Неверный формат", email),
    },

    password: {
      minLength: helpers.withMessage(
        "Пароль должен состоять из 10 цифр",
        minLength(10)
      ),
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
  }));

  const v$ = useVuelidate(rules, loginForm);

  const emailError = computed(() =>
    unref(v$.value.email?.$errors[0]?.$message ?? "")
  );

  const passwordError = computed(() =>
    unref(v$.value.password?.$errors[0]?.$message ?? "")
  );

  const runValidate = () => {
    v$.value.$validate();
  };

  const clearErrors = () => {
    v$.value.$reset();
  };

  const isError = computed(() => v$.value.$error);

  const resetForm = () => {
    loginForm.email = "";
    loginForm.password = "";
    clearErrors();
  };

  return {
    loginForm,
    emailError,
    passwordError,
    runValidate,
    resetForm,
    isError,
  };
}
