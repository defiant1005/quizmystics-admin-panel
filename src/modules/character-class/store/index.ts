import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import {
  ICharacterClass,
  ICharacterClassParams,
} from "@/modules/character-class/types";
import {
  apiCreateCharacterClass,
  apiEditCharacterClass,
  apiGetCharacterClassById,
  apiGetCharacterClasses,
  apiRemoveCharacterClass,
} from "@/modules/character-class/api";

export const useCharacterClassStore = defineStore("character-class-store", {
  state: () => ({
    characterClasses: null as null | ICharacterClass[],
    currentCharacterClass: null as null | ICharacterClass,
  }),

  getters: {
    characterClassesList(store) {
      return Array.isArray(store.characterClasses)
        ? store.characterClasses
        : [];
    },

    isCharacterClassesEmpty(store) {
      return !Array.isArray(store.characterClasses);
    },
  },

  actions: {
    async getCharacterClasses() {
      try {
        const response = await apiGetCharacterClasses();
        this.characterClasses = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async getCharacterClassById(characterClassId: number) {
      try {
        const response = await apiGetCharacterClassById(characterClassId);
        this.currentCharacterClass = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async createCharacterClass(params: ICharacterClassParams) {
      try {
        await apiCreateCharacterClass(params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async editCharacterClass(
      characterClassId: number,
      params: ICharacterClassParams
    ) {
      try {
        await apiEditCharacterClass(characterClassId, params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async removeCharacterClass(characterClassId: number) {
      try {
        await apiRemoveCharacterClass(characterClassId);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    removeCurrentCharacterClass() {
      this.currentCharacterClass = null;
    },
  },
});
