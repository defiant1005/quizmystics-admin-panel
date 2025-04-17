import { useAbilityStore } from "@/modules/ability/store";
import { computed } from "vue";

export function useCheckAbilityName() {
  const abilityStore = useAbilityStore();

  const abilitiesList = computed(() => {
    return abilityStore.abilitiesList.map((ability) => {
      return {
        label: ability.title,
        value: ability.id,
      };
    });
  });

  const checkAbilityName = (abilityId: number) => {
    return (
      abilitiesList.value.find((item) => item.value === abilityId)?.label ?? "-"
    );
  };

  return {
    abilitiesList,
    checkAbilityName,
  };
}
