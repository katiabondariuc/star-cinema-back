import { MainRoleEnum } from "../enums/main-role.enum";

export interface JwtUserPayload {
  id: number;
  email: string;
  role: MainRoleEnum;
}