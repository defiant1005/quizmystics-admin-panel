import {
  AnswerVariant,
  IQuestionForm,
  IQuestionParams,
} from "@/modules/question/types";

export function normalizeForm(form: IQuestionForm): IQuestionParams {
  return {
    title: form.title.trim(),
    [AnswerVariant.ANSWER1]: form[AnswerVariant.ANSWER1].trim(),
    [AnswerVariant.ANSWER2]: form[AnswerVariant.ANSWER2].trim(),
    [AnswerVariant.ANSWER3]: form[AnswerVariant.ANSWER3].trim(),
    [AnswerVariant.ANSWER4]: form[AnswerVariant.ANSWER4].trim(),
    correct_answer: form.correct_answer,
    categoryId: form.categoryId,
  };
}
