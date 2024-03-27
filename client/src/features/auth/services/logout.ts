import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

export const logout = tryCatchWrapper(async (): Promise<void> => {
  const res = await fetch('/api/v1/auth/logout', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Exception(data.message, res.status);
  }
});
