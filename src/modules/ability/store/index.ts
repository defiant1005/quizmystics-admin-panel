import { defineStore } from "pinia";
import { errorHandler } from "@/package/global-helpers/error-handler";
import { IAbility, IAbilityParams } from "@/modules/ability/types";
import {
  apiCreateAbility,
  apiEditAbility,
  apiGetAbilities,
  apiGetAbilityById,
  apiRemoveAbility,
} from "@/modules/ability/api";

export const useAbilityStore = defineStore("ability-store", {
  state: () => ({
    abilities: null as null | IAbility[],
    currentAbility: null as null | IAbility,
  }),

  getters: {
    abilitiesList(store) {
      return Array.isArray(store.abilities) ? store.abilities : [];
    },

    isAbilitiesEmpty(store) {
      return !Array.isArray(store.abilities);
    },
  },

  actions: {
    async getAbilities() {
      try {
        const response = await apiGetAbilities();
        this.abilities = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async getAbilityById(abilityId: number) {
      try {
        const response = await apiGetAbilityById(abilityId);
        this.currentAbility = response.data.data;
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async createAbility(params: IAbilityParams) {
      try {
        await apiCreateAbility(params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async editAbility(abilityId: number, params: IAbilityParams) {
      try {
        await apiEditAbility(abilityId, params);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    async removeAbility(abilityId: number) {
      try {
        await apiRemoveAbility(abilityId);
      } catch (e) {
        errorHandler(e);
        throw e;
      }
    },

    removeCurrentAbility() {
      this.currentAbility = null;
    },
  },
});
