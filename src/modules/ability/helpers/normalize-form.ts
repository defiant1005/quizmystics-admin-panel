import { IAbilityForm, IAbilityParams } from "@/modules/ability/types";

export function normalizeForm(abilityForm: IAbilityForm): IAbilityParams {
  return {
    title: abilityForm.title.trim(),
    slug: abilityForm.slug,
    description: abilityForm.description.trim(),
  };
}
