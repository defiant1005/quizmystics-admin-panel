import { IAbility } from "@/modules/ability/types";

export type CharacterLives = 1 | 2 | 3;

export interface IAbilitiesCooldown {
  abilityId: number;
  cooldown: number;
}

export interface ICharacterAbility extends IAbility {
  cooldown: number;
}

export interface ICharacterAbilityParams {
  abilityId: number;
  cooldown: number;
}

export interface ICharacterClass {
  id: number;
  title: string;
  description: string;
  luck: number;
  lives: CharacterLives;
  abilities: ICharacterAbility[];
}

export interface ICharacterClassForm
  extends Omit<ICharacterClass, "id" | "luck" | "abilities"> {
  luck: string;
  selectedAbilities: number[];
  cooldowns: IAbilitiesCooldown[];
}

export interface ICharacterClassParams
  extends Omit<
    ICharacterClassForm,
    "luck" | "cooldowns" | "selectedAbilities"
  > {
  luck: number;
  abilities: ICharacterAbilityParams[];
}

export interface ICharacterClassResponse {
  data: ICharacterClass[];
}

export interface ICharacterClassByIdResponse {
  data: ICharacterClass;
}
