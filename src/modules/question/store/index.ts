import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { IQuestion, IQuestionParams } from "@/modules/question/types";
import {
  apiCreateQuestion,
  apiEditQuestion,
  apiGetQuestionById,
  apiGetQuestions,
  apiRemoveQuestion,
} from "@/modules/question/api";

export const useQuestionStore = defineStore("question-store", {
  state: () => ({
    questions: null as null | IQuestion[],
    currentQuestion: null as null | IQuestion,
  }),

  getters: {
    questionsList(store) {
      return Array.isArray(store.questions) ? store.questions : [];
    },

    isQuestionsEmpty(store) {
      return !Array.isArray(store.questions);
    },
  },

  actions: {
    async getQuestions() {
      try {
        const response = await apiGetQuestions();
        this.questions = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async getQuestionById(questionId: number) {
      try {
        const response = await apiGetQuestionById(questionId);
        this.currentQuestion = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async createQuestion(params: IQuestionParams) {
      try {
        await apiCreateQuestion(params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async editQuestion(questionId: number, params: IQuestionParams) {
      try {
        await apiEditQuestion(questionId, params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async removeQuestion(questionId: number) {
      try {
        await apiRemoveQuestion(questionId);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    removeCurrentQuestion() {
      this.currentQuestion = null;
    },
  },
});
