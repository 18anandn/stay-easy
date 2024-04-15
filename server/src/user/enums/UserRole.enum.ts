import { EnumValues } from '../../types/EnumValues';

export const UserRoleEnum = {
  ADMIN: 'admin',
  OWNER: 'owner',
  EMPLOYEE: 'employee',
  USER: 'user',
} as const;

export type UserRole = EnumValues<typeof UserRoleEnum>;
