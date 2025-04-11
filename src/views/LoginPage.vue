<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { useLoginForm } from "@/modules/auth/composables/use-login-form";
import { useAuthStore } from "@/modules/auth/store";
import { ElNotification } from "element-plus";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router/routes";

defineComponent({
  name: "LoginPage",
});

const authStore = useAuthStore();
const router = useRouter();

const {
  loginForm,
  emailError,
  passwordError,
  runValidate,
  resetForm,
  isError,
} = useLoginForm();

const isLoading = ref(false);

const submitForm = async () => {
  runValidate();

  if (isError.value) {
    return;
  }

  try {
    isLoading.value = false;

    await authStore.login(loginForm);
    await authStore.getMe();

    await router.replace({
      name: RouteNames.ADMINS_VIEW,
    });

    resetForm();
  } catch (e: unknown) {
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
  <div class="login-page">
    <form @submit.prevent="submitForm">
      <h2>Вход</h2>

      <fieldset>
        <ElInput
          id="login-email"
          v-model="loginForm.email"
          placeholder="Email"
          type="email"
          name="email"
          size="large"
        />

        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </fieldset>

      <fieldset>
        <ElInput
          id="login-password"
          v-model="loginForm.password"
          placeholder="Пароль"
          type="password"
          show-password
          name="password"
          size="large"
        />

        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </fieldset>

      <ElButton
        size="large"
        type="primary"
        native-type="submit"
        :disabled="isLoading"
      >
        Войти
      </ElButton>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;

  > form {
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    > fieldset {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .error-message {
        color: rgb(247, 137.4, 137.4);
      }
    }
  }
}
</style>
