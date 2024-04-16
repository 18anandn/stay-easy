import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/logout';

export const useLogout = () => useMutation({ mutationFn: logout });
