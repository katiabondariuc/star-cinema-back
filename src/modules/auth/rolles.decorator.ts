// auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { MainRoleEnum } from '../../shared/enums/main-role.enum';

export const Roles = (...roles: MainRoleEnum[]) =>
  SetMetadata('roles', roles);