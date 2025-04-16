import { computed, reactive, ref, unref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { ICharacterClassForm } from "@/modules/character-class/types";

export function useCreateCharacterClass() {
  const createCharacterClassForm = reactive<ICharacterClassForm>({
    title: "",
    description: "",
    luck: "",
    lives: 1,
    selectedAbilities: [],
    cooldowns: [],
  });

  const checkMaxValueLuck = () => {
    const numLuck = Number(createCharacterClassForm.luck);
    return !isNaN(numLuck) && numLuck <= 15;
  };

  const checkLivesHandler = () => {
    const numLives = Number(createCharacterClassForm.lives);
    return (
      !isNaN(numLives) && (numLives === 1 || numLives === 2 || numLives === 3)
    );
  };

  const checkCooldownsHandler = () => {
    return (
      createCharacterClassForm.selectedAbilities.length ===
        createCharacterClassForm.cooldowns.length &&
      !createCharacterClassForm.cooldowns.find((item) => item.cooldown < 1)
    );
  };

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    description: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    luck: {
      required: helpers.withMessage("Поле не может быть пустым", required),
      checkMaxValueLuck: helpers.withMessage("Не более 15%", checkMaxValueLuck),
    },
    selectedAbilities: {
      required: helpers.withMessage("Поле не может быть пустым", required),
    },
    cooldowns: {
      required: helpers.withMessage("Поле не может быть пустым", required),
      checkCooldowns: helpers.withMessage(
        "Выберите перезарядку для всех способностей",
        checkCooldownsHandler
      ),
    },
    lives: {
      required: helpers.withMessage("Поле не может быть пустым", required),
      checkLivesHandler: helpers.withMessage(
        "Жизней может быть от 1 до 3",
        checkLivesHandler
      ),
    },
  }));

  const v$ = useVuelidate(rules, createCharacterClassForm);

  const titleError = computed(() =>
    unref(v$.value.title?.$errors[0]?.$message ?? "")
  );

  const descriptionError = computed(() =>
    unref(v$.value.description?.$errors[0]?.$message ?? "")
  );

  const luckError = computed(() =>
    unref(v$.value.luck?.$errors[0]?.$message ?? "")
  );

  const livesError = computed(() =>
    unref(v$.value.lives?.$errors[0]?.$message ?? "")
  );

  const selectedAbilitiesError = computed(() =>
    unref(v$.value.selectedAbilities?.$errors[0]?.$message ?? "")
  );

  const cooldownsError = computed(() =>
    unref(v$.value.cooldowns?.$errors[0]?.$message ?? "")
  );

  const runValidate = async () => {
    await v$.value.$validate();
  };

  const clearErrors = () => {
    v$.value.$reset();
  };

  const isError = computed(() => v$.value.$error);

  const resetForm = () => {
    createCharacterClassForm.title = "";
    createCharacterClassForm.description = "";
    createCharacterClassForm.luck = "";
    createCharacterClassForm.lives = 1;
    createCharacterClassForm.selectedAbilities = [];
    createCharacterClassForm.cooldowns = [];
    clearErrors();
  };

  const updateSelectedAbilitiesHandler = () => {
    createCharacterClassForm.cooldowns =
      createCharacterClassForm.cooldowns.filter((cooldown) => {
        return createCharacterClassForm.selectedAbilities.find(
          (abilityId) => abilityId === cooldown.abilityId
        );
      });

    const deltaLength =
      createCharacterClassForm.selectedAbilities.length -
      createCharacterClassForm.cooldowns.length;

    if (deltaLength > 0) {
      for (let i = 0; i < deltaLength; i++) {
        const abilityId = createCharacterClassForm.selectedAbilities.find(
          (abilityId) => {
            return (
              createCharacterClassForm.cooldowns.findIndex(
                (cooldown) => cooldown.abilityId === abilityId
              ) === -1
            );
          }
        );

        if (typeof abilityId !== "number") {
          continue;
        }

        createCharacterClassForm.cooldowns.push({
          abilityId: abilityId,
          cooldown: 1,
        });
      }
    }
  };

  const currentCooldowns = ref([]);

  const updateCooldownHandler = (cooldown: unknown, abilityId: number) => {
    if (typeof cooldown !== "number") {
      return;
    }

    const currentCooldownIndex = createCharacterClassForm.cooldowns.findIndex(
      (item) => item.abilityId === abilityId
    );

    if (currentCooldownIndex === -1) {
      createCharacterClassForm.cooldowns.push({
        abilityId: abilityId,
        cooldown: cooldown,
      });
    } else {
      createCharacterClassForm.cooldowns[currentCooldownIndex] = {
        abilityId: abilityId,
        cooldown: cooldown,
      };
    }
  };

  return {
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
  };
}
