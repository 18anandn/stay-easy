import styled from 'styled-components';
import { StyledLogin } from './Login';
import Label from '../../components/Label';
import ErrorMessage from '../../components/ErrorMessage';
import Input from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import SpinnerWithText from '../../components/loaders/SpinnerWithText';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  EmailForResetPassword,
  EmailForResetPasswordSchema,
} from '../../features/auth/types/EmailForResetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHandleEmailForForgetPassword } from '../../features/auth/hooks/useHandleEmailForForgetPassword';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser';
import Spinner from '../../components/loaders/Spinner';
import NotFoundPage from '../NotFoundPage';

const StyledForgotPassword = styled(StyledLogin)``;

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForResetPassword>({
    resolver: zodResolver(EmailForResetPasswordSchema),
  });
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const { mutate: submitEmail, isPending } = useHandleEmailForForgetPassword();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<EmailForResetPassword> = (data) => {
    submitEmail(data, {
      onSuccess: () => {
        toast.success('Check your email for further steps', { duration: 5000 });
        navigate('/', { replace: true });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (currentUser) {
    return <NotFoundPage />;
  }

  return (
    <StyledForgotPassword>
      {isLoadingCurrentUser ? (
        <Spinner />
      ) : (
        <>
          {!currentUser && (
            <div className="box">
              <h1>Reset password</h1>
              <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                  <Label>
                    {errors?.email?.message ? (
                      <ErrorMessage>{errors.email.message}</ErrorMessage>
                    ) : (
                      'Enter your email address'
                    )}
                  </Label>
                  <Input
                    type="text"
                    id="email"
                    disabled={isPending}
                    {...register('email')}
                  />
                </div>
                <Button disabled={isPending} type="submit">
                  <SpinnerWithText
                    isLoading={isPending}
                    text="Submit"
                    color="white"
                  />
                </Button>
              </form>
            </div>
          )}
        </>
      )}
    </StyledForgotPassword>
  );
};

export default ForgotPassword;
