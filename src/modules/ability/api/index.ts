import API from "@/package/config/axios";
import { AxiosResponse } from "axios";
import {
  IAbilityByIdResponse,
  IAbilityParams,
  IAbilityResponse,
} from "@/modules/ability/types";

export const apiGetAbilities = (): Promise<AxiosResponse<IAbilityResponse>> => {
  return API.get("ability");
};

export const apiGetAbilityById = (
  abilityId: number
): Promise<AxiosResponse<IAbilityByIdResponse>> => {
  return API.get(`ability/${abilityId}`);
};

export const apiCreateAbility = (params: IAbilityParams) => {
  return API.post("ability", params);
};
export const apiEditAbility = (abilityId: number, params: IAbilityParams) => {
  return API.put(`ability/${abilityId}`, params);
};

export const apiRemoveAbility = (abilityId: number) => {
  return API.delete(`ability/${abilityId}`);
};
