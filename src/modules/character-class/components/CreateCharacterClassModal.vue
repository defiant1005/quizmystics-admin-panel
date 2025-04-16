<script lang="ts" setup>
import { computed, PropType, ref, watch } from "vue";
import { ElNotification } from "element-plus";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { useCreateCharacterClass } from "@/modules/character-class/composables/use-create-character-class";
import { normalizeForm } from "@/modules/character-class/helpers/normalize-form";
import { useCharacterClassStore } from "@/modules/character-class/store";
import { ICharacterClass } from "@/modules/character-class/types";
import { useAbilityStore } from "@/modules/ability/store";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  characterClassId: {
    type: [Number, null] as PropType<number | null>,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

defineOptions({
  name: "CreateCharacterClassModal",
});

const _modelValue = computed({
  get: () => props.modelValue,

  set: (value) => emit("update:modelValue", value),
});

const characterClassStore = useCharacterClassStore();
const abilityStore = useAbilityStore();

const abilitiesList = computed(() => {
  return abilityStore.abilitiesList.map((ability) => {
    return {
      label: ability.title,
      value: ability.id,
    };
  });
});

const currentCharacterClass = computed<ICharacterClass | null>(
  () => characterClassStore.currentCharacterClass
);

const {
  createCharacterClassForm,
  titleError,
  luckError,
  livesError,
  descriptionError,
  selectedAbilitiesError,
  cooldownsError,
  runValidate,
  isError,
  resetForm,
  updateSelectedAbilitiesHandler,
  currentCooldowns,
  updateCooldownHandler,
} = useCreateCharacterClass();

const closeModal = () => {
  _modelValue.value = false;

  resetForm();
};

const isEdit = computed(() => props.characterClassId !== null);

const isLoading = ref(false);

const editCharacterClassSubmit = async () => {
  if (!isEdit.value) {
    return;
  }

  try {
    isLoading.value = true;
    const params = normalizeForm(createCharacterClassForm);

    await characterClassStore.editCharacterClass(
      props.characterClassId!,
      params
    );
    await characterClassStore.getCharacterClasses();

    ElNotification({
      title: "Успешно",
      message: "Класс отредактирован",
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

const createCharacterClassSubmit = async () => {
  try {
    isLoading.value = true;
    const params = normalizeForm(createCharacterClassForm);
    await characterClassStore.createCharacterClass(params);
    await characterClassStore.getCharacterClasses();

    ElNotification({
      title: "Успешно",
      message: "Класс создан",
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
    await editCharacterClassSubmit();
    return;
  }

  await createCharacterClassSubmit();
};

const setDefaultData = () => {
  if (currentCharacterClass.value === null) {
    return;
  }

  createCharacterClassForm.title = currentCharacterClass.value.title;
  createCharacterClassForm.description =
    currentCharacterClass.value.description;
  createCharacterClassForm.luck = currentCharacterClass.value.luck.toString();
  createCharacterClassForm.lives = currentCharacterClass.value.lives;
  // createCharacterClassForm.abilities = currentCharacterClass.value.lives;
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

const checkAbilityName = (abilityId: number) => {
  return (
    abilitiesList.value.find((item) => item.value === abilityId)?.label ?? "-"
  );
};
</script>

<template>
  <ElDialog
    v-model="_modelValue"
    :title="
      isEdit ? 'Редактирование класса персонажа' : 'Создание класса персонажа'
    "
    width="500"
  >
    <ElForm :model="createCharacterClassForm" @submit.prevent="submitForm">
      <ElFormItem label-position="top" label="Заголовок">
        <ElInput
          v-model="createCharacterClassForm.title"
          placeholder="Заголовок"
          name="title"
          size="large"
        />

        <p v-if="titleError" class="error-message">{{ titleError }}</p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Способности">
        <ElSelect
          v-model="createCharacterClassForm.selectedAbilities"
          multiple
          collapse-tags
          size="large"
          collapse-tags-tooltip
          placeholder="Выберите способности"
          @update:modelValue="updateSelectedAbilitiesHandler"
        >
          <ElOption
            v-for="item in abilitiesList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>

        <p v-if="selectedAbilitiesError" class="error-message">
          {{ selectedAbilitiesError }}
        </p>
      </ElFormItem>

      <ElFormItem
        v-if="createCharacterClassForm.selectedAbilities.length > 0"
        label-position="top"
        label="Перезарядка способностей, кол-во ходов"
      >
        <div class="ability-cooldown">
          <div
            v-for="(
              abilityId, index
            ) in createCharacterClassForm.selectedAbilities"
            :key="abilityId"
            class="ability-cooldown__item"
          >
            <p class="label">{{ checkAbilityName(abilityId) }}</p>

            <ElInputNumber
              v-model="currentCooldowns[index]"
              :min="1"
              size="large"
              name="ability"
              :max="15"
              @update:modelValue="
                (val: unknown) => updateCooldownHandler(val, abilityId)
              "
            />
          </div>
        </div>

        <p v-if="cooldownsError" class="error-message">
          {{ cooldownsError }}
        </p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Удача, %">
        <ElInput
          v-model="createCharacterClassForm.luck"
          placeholder="Удача"
          name="luck"
          size="large"
        />

        <p v-if="luckError" class="error-message">
          {{ luckError }}
        </p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Количество жизней">
        <ElInputNumber
          v-model="createCharacterClassForm.lives"
          :min="1"
          size="large"
          name="lives"
          :max="3"
        />

        <p v-if="livesError" class="error-message">
          {{ livesError }}
        </p>
      </ElFormItem>

      <ElFormItem label-position="top" label="Описание">
        <ElInput
          v-model="createCharacterClassForm.description"
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

<style scoped lang="scss">
.ability-cooldown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
