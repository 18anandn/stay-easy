import Cookies from 'js-cookie';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

type UserToken = {
  userId: string;
  role: string;
};

export const getCurrentUser = tryCatchWrapper(
  async (): Promise<UserToken | null> => {
    if (!Cookies.get('logged-in')) {
      return null;
    }
    const res = await fetch('/api/v1/auth', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    const data = await res.json();

    if (!res.ok) {
      return null;
    }

    return data;
  }
);
