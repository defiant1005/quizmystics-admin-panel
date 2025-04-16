<script lang="ts" setup>
import { computed, ref } from "vue";
import { onMounted } from "vue";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import { useCharacterClassStore } from "@/modules/character-class/store";
import CreateCharacterClassModal from "@/modules/character-class/components/CreateCharacterClassModal.vue";
import { useAbilityStore } from "@/modules/ability/store";

defineOptions({
  name: "CharacterClassView",
});

const classStore = useCharacterClassStore();
const abilityStore = useAbilityStore();

const characterClassesList = computed(() => classStore.characterClassesList);

const isLoading = ref(false);
const isModalOpen = ref(false);
const isEditLoading = ref(false);
const isDeleteDisabled = ref(false);

const classId = ref<null | number>(null);

const handleEdit = async (_classId: number) => {
  classId.value = _classId;

  try {
    isEditLoading.value = true;
    await classStore.getCharacterClassById(_classId);
    isModalOpen.value = true;
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

const handleDelete = async (_classId: number) => {
  try {
    isDeleteDisabled.value = true;
    await classStore.removeCharacterClass(_classId);
    await classStore.getCharacterClasses();
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
    classId.value = null;
    classStore.removeCurrentCharacterClass();
  }
};

onMounted(async () => {
  if (classStore.isCharacterClassesEmpty) {
    try {
      isLoading.value = true;
      await classStore.getCharacterClasses();
    } finally {
      isLoading.value = false;
    }
  }

  if (abilityStore.isAbilitiesEmpty) {
    await abilityStore.getAbilities();
  }
});
</script>

<template>
  <ElScrollbar>
    <ElTable v-loading="isLoading" :data="characterClassesList" border>
      <ElTableColumn prop="id" label="ID" width="140" />

      <ElTableColumn prop="title" label="Заголовок" />

      <ElTableColumn prop="luck" label="Удача" />

      <ElTableColumn prop="lives" label="Количество жизней" />

      <ElTableColumn label="Operations">
        <template #header>
          <ElButton @click="isModalOpen = true"> Создать класс </ElButton>
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

    <CreateCharacterClassModal
      v-model="isModalOpen"
      :character-class-id="classId"
      @update:modelValue="closeHandler"
    />
  </ElScrollbar>
</template>
