import { AxiosResponse } from "axios";
import API from "@/package/config/axios";
import {
  ICharacterClassByIdResponse,
  ICharacterClassParams,
  ICharacterClassResponse,
} from "@/modules/character-class/types";

export const apiGetCharacterClasses = (): Promise<
  AxiosResponse<ICharacterClassResponse>
> => {
  return API.get("character-class");
};

export const apiGetCharacterClassById = (
  characterClassId: number
): Promise<AxiosResponse<ICharacterClassByIdResponse>> => {
  return API.get(`character-class/${characterClassId}`);
};

export const apiCreateCharacterClass = (params: ICharacterClassParams) => {
  return API.post("character-class", params);
};
export const apiEditCharacterClass = (
  characterClassId: number,
  params: ICharacterClassParams
) => {
  return API.put(`character-class/${characterClassId}`, params);
};

export const apiRemoveCharacterClass = (characterClassId: number) => {
  return API.delete(`character-class/${characterClassId}`);
};
