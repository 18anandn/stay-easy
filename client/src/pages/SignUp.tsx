import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { StyledLogin } from './Login';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/inputs/Input';
import Button from '../components/buttons/Button';
import GoogleSignInButton from '../components/GoogleSignInButton';
import SpinnerWithText from '../components/loaders/SpinnerWithText';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { AuthMessage } from '../features/auth/enums/AuthMessage.enum';
import { authWithGoogle } from '../features/auth/utils/authWithGoogle';
import {
  SignUpInfo,
  SignUpInfoSchema,
} from '../features/auth/types/SignUpInfo';
import { useSignUpUser } from '../features/auth/hooks/useSignUpUser';
import CloseButton from '../components/buttons/CloseButton';
import Label from '../components/Label';
import styled from 'styled-components';
import { Subdomain, getSubdomain } from '../utils/getSubdomain';

const StyledSignUp = styled(StyledLogin)`
  .login-form {
    gap: 1rem;
  }

  .form-row {
    gap: 0.4rem;
  }
`;

const SignUp: React.FC = () => {
  const { isPending: isSigningUp, mutate: signUpUser } = useSignUpUser();
  const { refetch, isRefetching, isRefetchError, error, currentUser } =
    useCurrentUser();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirectTo');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignUpInfo>({ resolver: zodResolver(SignUpInfoSchema) });
  const isRefetchedUser = useRef(false);

  useEffect(() => {
    if (currentUser) {
      const redirectUrl = new URLSearchParams(window.location.search).get(
        'redirectTo'
      );
      if (getSubdomain() === Subdomain.MAIN) {
        if (isRefetchedUser.current) {
          toast.success('Successfully logged in');
          navigate(redirectUrl ?? '/', { replace: true });
        } else {
          navigate(-1);
        }
      } else {
        let redirectPath = '/auth';
        if (isRefetchedUser.current) {
          if (redirectUrl) {
            const redirectParam = new URLSearchParams();
            redirectParam.set('redirectTo', redirectUrl);
            redirectPath += `?${redirectParam.toString()}`;
          }
          window.location.replace(redirectPath);
        } else {
          window.history.back();
        }
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const catchMessage = (event: MessageEvent) => {
      if (event.data === AuthMessage.SUCCESS) {
        refetch();
        isRefetchedUser.current = true;
      } else {
        toast.error('Signup failed');
      }
    };

    window.addEventListener('message', catchMessage);

    return () => window.removeEventListener('message', catchMessage);
  }, [refetch]);

  useEffect(() => {
    if (isRefetchError) {
      toast.error(error?.message ?? 'There was an unknown error signing up');
    }
  }, [isRefetchError, error]);

  const onSubmit: SubmitHandler<SignUpInfo> = (data) => {
    signUpUser(data, {
      onSuccess: () => {
        toast.success(
          (t) => (
            <>
              <span style={{ marginRight: '0.7rem' }}>
                Verification mail sent to the given email address.
              </span>
              <CloseButton
                style={{
                  fontSize: '0.4rem',
                  position: 'absolute',
                  right: '0.3rem',
                  top: '50%',
                  translate: '0 -50%',
                }}
                onClick={() => toast.dismiss(t.id)}
              />
            </>
          ),
          { duration: 1000000000 }
        );
        navigate(`/login?${searchParams.toString()}`, { replace: true });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const isBeingSignedIn = isSigningUp || isRefetching;

  return (
    <StyledSignUp>
      <div className="box">
        <h1>{redirectUrl ? 'Sign up to continue' : 'Sign up'}</h1>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <Label>
              {errors?.first_name?.message ? (
                <ErrorMessage>{errors.first_name.message}</ErrorMessage>
              ) : (
                'First name'
              )}
            </Label>
            <Input
              type="text"
              id="first_name"
              disabled={isBeingSignedIn}
              {...register('first_name')}
            />
          </div>
          <div className="form-row">
            <Label>
              {errors?.last_name?.message ? (
                <ErrorMessage>{errors.last_name.message}</ErrorMessage>
              ) : (
                'Last name'
              )}
            </Label>
            <Input
              type="text"
              id="last_name"
              disabled={isBeingSignedIn}
              {...register('last_name')}
            />
          </div>
          <div className="form-row">
            <Label>
              {errors?.email?.message ? (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              ) : (
                'Email'
              )}
            </Label>
            <Input
              type="text"
              id="email"
              disabled={isBeingSignedIn}
              {...register('email')}
            />
          </div>
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
              disabled={isBeingSignedIn}
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
              disabled={isBeingSignedIn}
              {...register('confirm_password')}
            />
          </div>
          <Button disabled={isBeingSignedIn} type="submit">
            <SpinnerWithText
              isLoading={isBeingSignedIn}
              text="Sign up"
              color="white"
            />
          </Button>
          <GoogleSignInButton
            disabled={isBeingSignedIn}
            process="Sign up"
            type="button"
            className="google-button"
            onClick={authWithGoogle}
          />
          <p className="sign-up-link">
            Already have an account?{' '}
            <Link
              to={{ pathname: '/login', search: searchParams.toString() }}
              replace={true}
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </StyledSignUp>
  );
};

export default SignUp;
