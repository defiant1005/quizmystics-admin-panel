import { IAdmin } from "@/modules/admins/types";

export interface ILoginForm {
  email: string;
  password: string;
}

export interface ILoginParams extends ILoginForm {}

export interface ILoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: IAdmin;
  };
}

export interface IRefreshParams {
  refreshToken: string;
}
