import API from "@/package/config/axios";
import {
  ILoginParams,
  ILoginResponse,
  IRefreshParams,
} from "@/modules/auth/types";
import { AxiosResponse } from "axios";
import { IGetMeResponse } from "@/modules/admins/types";

export const apiLogin = (
  params: ILoginParams
): Promise<AxiosResponse<ILoginResponse>> => {
  return API.post("admin/login", params);
};

export const apiRefreshTokens = (
  params: IRefreshParams
): Promise<AxiosResponse<ILoginResponse>> => {
  return API.post("admin/refresh", params);
};

export const apiLogout = (params: IRefreshParams) => {
  return API.post("admin/logout", params);
};

export const apiGetMe = (): Promise<AxiosResponse<IGetMeResponse>> => {
  return API.get("admin/me");
};
