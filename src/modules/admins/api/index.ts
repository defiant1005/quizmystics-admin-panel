import API from "@/package/config/axios";
import { AxiosResponse } from "axios";
import { IAdminResponse } from "@/modules/admins/types";

export const apiGetAdmins = (): Promise<AxiosResponse<IAdminResponse>> => {
  return API.get("admin/admins");
};
