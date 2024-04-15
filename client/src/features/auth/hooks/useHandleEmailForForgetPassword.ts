import { useMutation } from '@tanstack/react-query';
import { getResetPasswordMail } from '../services/getResetPasswordMail';

export const useHandleEmailForForgetPassword = () =>
  useMutation({ mutationFn: getResetPasswordMail });
