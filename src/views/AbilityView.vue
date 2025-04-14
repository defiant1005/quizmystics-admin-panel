<script lang="ts" setup>
import { computed, ref } from "vue";
import { onMounted } from "vue";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { ElNotification } from "element-plus";
import { useAbilityStore } from "@/modules/ability/store";
import CreateAbilityModal from "@/modules/ability/components/CreateAbilityModal.vue";

defineOptions({
  name: "AbilityView",
});

const abilityStore = useAbilityStore();

const abilitiesList = computed(() => abilityStore.abilitiesList);

const isLoading = ref(false);
const isAbilityMutationDataModal = ref(false);
const isEditLoading = ref(false);
const isDeleteDisabled = ref(false);

const abilityId = ref<null | number>(null);

const handleEdit = async (_abilityId: number) => {
  abilityId.value = _abilityId;

  try {
    isEditLoading.value = true;
    await abilityStore.getAbilityById(_abilityId);
    isAbilityMutationDataModal.value = true;
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

const handleDelete = async (_abilityId: number) => {
  try {
    isDeleteDisabled.value = true;
    await abilityStore.removeAbility(_abilityId);
    await abilityStore.getAbilities();
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
    abilityId.value = null;
    abilityStore.removeCurrentAbility();
  }
};

onMounted(async () => {
  if (abilityStore.isAbilitiesEmpty) {
    try {
      isLoading.value = true;
      await abilityStore.getAbilities();
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <ElScrollbar>
    <ElTable v-loading="isLoading" :data="abilitiesList" border>
      <ElTableColumn prop="id" label="ID" width="140" />

      <ElTableColumn prop="title" label="Заголовок" />

      <ElTableColumn label="Operations">
        <template #header>
          <ElButton @click="isAbilityMutationDataModal = true">
            Создать способность
          </ElButton>
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

    <CreateAbilityModal
      v-model="isAbilityMutationDataModal"
      :ability-id="abilityId"
      @update:modelValue="closeHandler"
    />
  </ElScrollbar>
</template>
