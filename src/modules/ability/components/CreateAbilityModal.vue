<script lang="ts" setup>
import { computed, PropType, ref, watch } from "vue";
import { ElNotification } from "element-plus";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { useAbilityStore } from "@/modules/ability/store";
import { AbilitySlug, IAbility } from "@/modules/ability/types";
import { useCreateAbility } from "@/modules/ability/composables/use-create-ability";
import { translateAbility } from "@/modules/ability/helpers/translate-ability";
import { normalizeForm } from "@/modules/ability/helpers/normalize-form";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  abilityId: {
    type: [Number, null] as PropType<number | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

defineOptions({
  name: "CreateAbilityModal",
});

const _modelValue = computed({
  get: () => props.modelValue,

  set: (value) => emit("update:modelValue", value),
});

const abilityStore = useAbilityStore();

const currentAbility = computed<IAbility | null>(
  () => abilityStore.currentAbility
);

const {
  createAbilityForm,
  titleError,
  slugError,
  descriptionError,
  runValidate,
  isError,
  resetForm,
} = useCreateAbility();

const closeModal = () => {
  _modelValue.value = false;

  resetForm();
};

const isEdit = computed(() => props.abilityId !== null);

const isLoading = ref(false);

const editAbilitySubmit = async () => {
  if (!isEdit.value) {
    return;
  }

  try {
    isLoading.value = true;
    const params = normalizeForm(createAbilityForm);
    await abilityStore.editAbility(props.abilityId!, params);
    await abilityStore.getAbilities();

    ElNotification({
      title: "Успешно",
      message: "Способность отредактирована",
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

const createAbilitySubmit = async () => {
  try {
    isLoading.value = true;
    const params = normalizeForm(createAbilityForm);
    await abilityStore.createAbility(params);
    await abilityStore.getAbilities();

    ElNotification({
      title: "Успешно",
      message: "Способность создана",
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
    await editAbilitySubmit();
    return;
  }

  await createAbilitySubmit();
};

const setDefaultData = () => {
  if (currentAbility.value === null) {
    return;
  }

  createAbilityForm.title = currentAbility.value.title;
  createAbilityForm.slug = currentAbility.value.slug;
  createAbilityForm.description = currentAbility.value.description;
};

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
    :title="isEdit ? 'Редактирование способности' : 'Создание способности'"
    width="500"
  >
    <ElForm :model="createAbilityForm" @submit.prevent="submitForm">
      <ElFormItem label-position="top" label="Заголовок">
        <ElInput
          v-model="createAbilityForm.title"
          placeholder="Заголовок"
          name="title"
          size="large"
        />

        <p v-if="titleError" class="error-message">{{ titleError }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Slug">
        <ElSelect
          v-model="createAbilityForm.slug"
          placeholder="Выберите slug"
          size="large"
        >
          <ElOption
            :label="translateAbility(AbilitySlug.LUCK)"
            :value="AbilitySlug.LUCK"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.FREEZE)"
            :value="AbilitySlug.FREEZE"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.HIDE_QUESTION)"
            :value="AbilitySlug.HIDE_QUESTION"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.HIDE_ONE)"
            :value="AbilitySlug.HIDE_ONE"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.SHUFFLE)"
            :value="AbilitySlug.SHUFFLE"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.REMOVE_WRONG)"
            :value="AbilitySlug.REMOVE_WRONG"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.COPY_ANSWER)"
            :value="AbilitySlug.COPY_ANSWER"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.SILENCE)"
            :value="AbilitySlug.SILENCE"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.BKB)"
            :value="AbilitySlug.BKB"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.REFLECT)"
            :value="AbilitySlug.REFLECT"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.SHORT_TIME)"
            :value="AbilitySlug.SHORT_TIME"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.PEEK)"
            :value="AbilitySlug.PEEK"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.DOUBLE_SHOT)"
            :value="AbilitySlug.DOUBLE_SHOT"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.TRAP_QUESTION)"
            :value="AbilitySlug.TRAP_QUESTION"
          />
          <ElOption
            :label="translateAbility(AbilitySlug.REMOVE_LUCK)"
            :value="AbilitySlug.REMOVE_LUCK"
          />
        </ElSelect>

        <p v-if="slugError" class="error-message">
          {{ slugError }}
        </p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Описание">
        <ElInput
          v-model="createAbilityForm.description"
          placeholder="Описание"
          type="textarea"
          name="title"
          :rows="4"
          size="large"
        />

        <p v-if="descriptionError" class="error-message">
          {{ descriptionError }}
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
