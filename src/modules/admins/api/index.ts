import API from "@/package/config/axios";
import { AxiosResponse } from "axios";
import { IAdminResponse, ICreateAdminParams } from "@/modules/admins/types";

export const apiGetAdmins = (): Promise<AxiosResponse<IAdminResponse>> => {
  return API.get("admin/admins");
};

export const apiCreateAdmin = (
  params: ICreateAdminParams
): Promise<AxiosResponse<IAdminResponse>> => {
  return API.post("admin/registration", params);
};
