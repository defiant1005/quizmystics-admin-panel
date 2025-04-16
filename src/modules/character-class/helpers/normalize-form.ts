import {
  ICharacterClassForm,
  ICharacterClassParams,
} from "@/modules/character-class/types";

export function normalizeForm(
  characterClassForm: ICharacterClassForm
): ICharacterClassParams {
  return {
    title: characterClassForm.title.trim(),
    description: characterClassForm.description.trim(),
    luck: Number(characterClassForm.luck),
    lives: characterClassForm.lives,
    abilities: characterClassForm.cooldowns,
  };
}

const test = {};
