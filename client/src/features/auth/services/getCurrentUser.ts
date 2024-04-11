import Cookies from 'js-cookie';
import { z } from 'zod';
import { UserRole } from '../enums/UserRole.enum';
import { customFetch } from '../../../utils/customFetch';

const CurrentUserSchema = z.union([
  z.object({
    id: z.string().uuid(),
    role: z.nativeEnum(UserRole),
  }),
  z.null(),
]);

type CurrentUser = z.infer<typeof CurrentUserSchema>;

export const getCurrentUser = async (): Promise<CurrentUser> => {
  if (!Cookies.get('logged-in')) {
    return null;
  }

  const data = await customFetch('/api/v1/auth', CurrentUserSchema, {
    errorMessage: '',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
};
