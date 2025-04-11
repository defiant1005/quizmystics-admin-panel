export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
}

export interface IAdmin {
  email: string;
  id: string;
  role: AdminRole;
}

export interface IAdminResponse {
  data: IAdmin[];
}

export interface IGetMeResponse {
  data: IAdmin;
}
