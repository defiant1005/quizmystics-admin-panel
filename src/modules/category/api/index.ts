import API from "@/package/config/axios";
import { AxiosResponse } from "axios";
import {
  ICategoryByIdResponse,
  ICategoryParams,
  ICategoryResponse,
} from "@/modules/category/types";

export const apiGetCategories = (): Promise<
  AxiosResponse<ICategoryResponse>
> => {
  return API.get("category");
};

export const apiGetCategoryById = (
  categoryId: number
): Promise<AxiosResponse<ICategoryByIdResponse>> => {
  return API.get(`category/${categoryId}`);
};

export const apiCreateCategory = (params: ICategoryParams) => {
  return API.post("category", params);
};
export const apiEditCategory = (
  categoryId: number,
  params: ICategoryParams
) => {
  return API.put(`category/${categoryId}`, params);
};

export const apiRemoveCategory = (categoryId: number) => {
  return API.delete(`category/${categoryId}`);
};
