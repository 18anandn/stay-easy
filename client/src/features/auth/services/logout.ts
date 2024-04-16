import { z } from 'zod';

import { customFetch } from '../../../utils/customFetch';

export const logout = async () => {
  await customFetch('/api/v1/auth/logout', z.any(), {
    errorMessage: 'There was an error logging out',
  });
};
