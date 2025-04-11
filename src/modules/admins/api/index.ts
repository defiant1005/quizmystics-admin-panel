import API from "@/package/config/axios";
import { AxiosResponse } from "axios";
import {
  IAdminResponse,
  ICreateAdminParams,
  ICurrentAdminResponse,
} from "@/modules/admins/types";

export const apiGetAdmins = (): Promise<AxiosResponse<IAdminResponse>> => {
  return API.get("admin/admins");
};

export const apiGetAdminById = (
  adminId: number
): Promise<AxiosResponse<ICurrentAdminResponse>> => {
  return API.get(`admin/admins/${adminId}`);
};

export const apiCreateAdmin = (params: ICreateAdminParams) => {
  return API.post("admin/registration", params);
};

export const apiEditAdmin = (adminId: number, params: ICreateAdminParams) => {
  return API.put(`admin/admins/${adminId}`, params);
};

export const apiDeleteAdmin = (adminId: number) => {
  return API.delete(`admin/admins/${adminId}`);
};
