import styled from 'styled-components';
import { StyledLogin } from './Login';
import ErrorMessage from '../../components/ErrorMessage';
import Input from '../../components/inputs/Input';
import Label from '../../components/Label';
import Button from '../../components/buttons/Button';
import SpinnerWithText from '../../components/loaders/SpinnerWithText';
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser';
import NotFoundPage from '../NotFoundPage';
import Spinner from '../../components/loaders/Spinner';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  PasswordRefined,
  PasswordSchemaRefined,
} from '../../features/auth/types/PasswordSchemaRefined';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetUserPassword } from '../../features/auth/hooks/useResetUserPassword';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const StyledReseUserPassword = styled(StyledLogin)``;

const ReseUserPassword: React.FC = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<PasswordRefined>({
    resolver: zodResolver(PasswordSchemaRefined),
  });
  const { mutate: resetUserPassword, isPending } = useResetUserPassword();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<PasswordRefined> = (newPassword) => {
    if (userId && token) {
      resetUserPassword(
        { userId, token, newPassword },
        {
          onSuccess: () => {
            toast.success('Password was reset successfully', {
              duration: 5000,
            });
            navigate('/login', { replace: true });
          },
          onError: (error) => {
            toast.error(error.message, {
              duration: 5000,
              id: 'reset-password-error',
            });
          },
        }
      );
    }
  };

  if (currentUser || !userId || !token) {
    return <NotFoundPage />;
  }

  return (
    <StyledReseUserPassword>
      {isLoadingCurrentUser ? (
        <Spinner />
      ) : (
        <div className="box">
          <h1>Enter your new password</h1>
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <Label>
                {errors?.password?.message ? (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                ) : (
                  'Password'
                )}
              </Label>
              <Input
                type="password"
                id="password"
                disabled={isPending}
                {...register('password', {
                  onChange: () => {
                    trigger('confirm_password');
                  },
                })}
              />
            </div>
            <div className="form-row">
              <Label>
                {errors?.confirm_password?.message ? (
                  <ErrorMessage>{errors.confirm_password.message}</ErrorMessage>
                ) : (
                  'Confirm Password'
                )}
              </Label>
              <Input
                type="password"
                id="confirm_password"
                disabled={isPending}
                {...register('confirm_password', {
                  onChange: () => trigger('confirm_password'),
                })}
              />
            </div>
            <Button disabled={isPending} type="submit">
              <SpinnerWithText
                isLoading={isPending}
                text="Reset"
                color="white"
              />
            </Button>
          </form>
        </div>
      )}
    </StyledReseUserPassword>
  );
};

export default ReseUserPassword;
