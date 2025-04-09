export interface ILoginForm {
  email: string;
  password: string;
}

export interface ILoginParams extends ILoginForm {}

export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
}

export interface IUser {
  id: number;
  email: string;
  role: AdminRole;
}

export interface ILoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
}

export interface ILogoutParams {
  refreshToken: string;
}
