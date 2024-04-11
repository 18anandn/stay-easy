import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';
import { Credentials } from '../types/LoginCreds';
import { UserRole } from '../enums/UserRole.enum';

const LoginResSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

type LoginRes = z.infer<typeof LoginResSchema>;

export const login = async (creds: Credentials): Promise<LoginRes> => {
  const data = await customFetch('/api/v1/auth/login', LoginResSchema, {
    errorMessage: 'There was an unknown error while logging in',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  });

  return data;
};
