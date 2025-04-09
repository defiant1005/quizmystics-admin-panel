import API from "@/package/config/axios";
import {
  ILoginParams,
  ILoginResponse,
  ILogoutParams,
} from "@/modules/auth/types";
import { AxiosResponse } from "axios";

export const apiLogin = (
  params: ILoginParams
): Promise<AxiosResponse<ILoginResponse>> => {
  return API.post("admin/login", params);
};

export const apiLogout = (params: ILogoutParams) => {
  return API.post("admin/logout", params);
};
