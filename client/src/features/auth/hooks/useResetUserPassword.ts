import { useMutation } from '@tanstack/react-query';
import { resetUserPassword } from '../services/resetUserPassword';

export const useResetUserPassword = () =>
  useMutation({ mutationFn: resetUserPassword });
