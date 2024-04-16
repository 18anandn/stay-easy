import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';
import { SignUpInfo } from '../types/SignUpInfo';

export const signup = async (userInfo: SignUpInfo) => {
  if (userInfo.last_name !== undefined && userInfo.last_name.length === 0) {
    delete userInfo.last_name;
  }
  await customFetch('/api/v1/auth/signup', z.any(), {
    errorMessage: 'There was an error signing up',
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });
};
