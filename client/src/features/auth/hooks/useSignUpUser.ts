import { useMutation } from '@tanstack/react-query';
import { signup } from '../services/signup';

export const useSignUpUser = () => {
  return useMutation({
    mutationFn: signup,
  });
};
