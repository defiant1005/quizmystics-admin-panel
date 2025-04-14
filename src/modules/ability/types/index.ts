export enum AbilitySlug {
  LUCK = "luck",
  FREEZE = "freeze",
  HIDE_QUESTION = "hide-question",
  HIDE_ONE = "hide-one",
  SHUFFLE = "shuffle",
  REMOVE_WRONG = "remove-wrong",
  COPY_ANSWER = "copy-answer",
  SILENCE = "silence",
  BKB = "bkb",
  REFLECT = "reflect",
  SHORT_TIME = "short-time",
  PEEK = "peek",
  DOUBLE_SHOT = "double-shot",
  TRAP_QUESTION = "trap-question",
  REMOVE_LUCK = "remove-luck",
}

export interface IAbility {
  id: number;
  title: string;
  slug: AbilitySlug;
  description: string;
}

export interface IAbilityForm extends Omit<IAbility, "id" | "slug"> {
  slug: AbilitySlug | "";
}

export interface IAbilityParams extends IAbilityForm {}

export interface IAbilityResponse {
  data: IAbility[];
}

export interface IAbilityByIdResponse {
  data: IAbility;
}
