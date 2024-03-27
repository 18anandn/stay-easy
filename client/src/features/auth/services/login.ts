import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';
import { LoginCreds } from '../types/LoginCreds';

type LoginRes = {
  userId: string;
  role: string;
};

export const login = tryCatchWrapper(
  async (body: LoginCreds): Promise<LoginRes> => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(data.message, res.status);
    }

    return data;
  },
);
