import { computed, reactive, unref } from "vue";
import { AdminRole, ICreateAdminForm } from "@/modules/admins/types";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export function useCreateAdmin() {
  const createAdminForm = reactive<ICreateAdminForm>({
    email: "",
    password: "",
    role: AdminRole.ADMIN,
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

    role: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
  }));

  const v$ = useVuelidate(rules, createAdminForm);

  const emailError = computed(() =>
    unref(v$.value.email?.$errors[0]?.$message ?? "")
  );

  const passwordError = computed(() =>
    unref(v$.value.password?.$errors[0]?.$message ?? "")
  );

  const roleError = computed(() =>
    unref(v$.value.role?.$errors[0]?.$message ?? "")
  );

  const runValidate = () => {
    v$.value.$validate();
  };

  const clearErrors = () => {
    v$.value.$reset();
  };

  const isError = computed(() => v$.value.$error);

  const resetForm = () => {
    createAdminForm.email = "";
    createAdminForm.password = "";
    createAdminForm.role = AdminRole.ADMIN;
    clearErrors();
  };

  return {
    createAdminForm,
    emailError,
    passwordError,
    roleError,
    runValidate,
    clearErrors,
    isError,
    resetForm,
  };
}
