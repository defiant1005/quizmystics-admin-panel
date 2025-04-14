import { AbilitySlug } from "@/modules/ability/types";
import { neverHandler } from "@/package/global-helpers/error-handler";

export function translateAbility(slug: AbilitySlug) {
  switch (slug) {
    case AbilitySlug.LUCK:
      return "Удача";
    case AbilitySlug.FREEZE:
      return "Заморозка";
    case AbilitySlug.HIDE_QUESTION:
      return "Скрыть вопрос";
    case AbilitySlug.HIDE_ONE:
      return "Скрыть один ответ";
    case AbilitySlug.SHUFFLE:
      return "Перемешать ответы";
    case AbilitySlug.REMOVE_WRONG:
      return "Убрать 1 неправильный";
    case AbilitySlug.COPY_ANSWER:
      return "Выбрать как другой";
    case AbilitySlug.SILENCE:
      return "Сайленс";
    case AbilitySlug.BKB:
      return "БКБ";
    case AbilitySlug.REFLECT:
      return "Обратка";
    case AbilitySlug.SHORT_TIME:
      return "Мозговой шторм";
    case AbilitySlug.PEEK:
      return "Подсмотрел";
    case AbilitySlug.DOUBLE_SHOT:
      return "Двойной удар";
    case AbilitySlug.TRAP_QUESTION:
      return "Вопрос с ловушкой";
    case AbilitySlug.REMOVE_LUCK:
      return "Сброс удачи";

    default:
      neverHandler(slug);
  }
}
