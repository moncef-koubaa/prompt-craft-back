import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export interface RolesOptions {
  matchAny?: boolean;
}

export const Roles = (roles: string[], options?: RolesOptions) =>
  SetMetadata(ROLES_KEY, { roles, ...options });
