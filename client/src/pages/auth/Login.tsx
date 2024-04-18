import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import Label from '../../components/Label';
import Input from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import Error from '../../components/Error';
import SpinnerWithText from '../../components/loaders/SpinnerWithText';
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser';
import { useLoginUser } from '../../features/auth/hooks/useLoginUser';
import { Subdomain, getSubdomain } from '../../utils/getSubdomain';
import { screenWidths } from '../../providers/ScreenProvider';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import ErrorMessage from '../../components/ErrorMessage';
import { AuthMessage } from '../../features/auth/enums/AuthMessage.enum';
import {
  CredentialSchema,
  Credentials,
} from '../../features/auth/types/LoginCreds';
import { authWithGoogle } from '../../features/auth/utils/authWithGoogle';
import { Exception } from '../../data/Exception';
import { useTitle } from '../../hooks/useTitle';
import { useQueryClient } from '@tanstack/react-query';
import Spinner from '../../components/loaders/Spinner';
import RedirectingBox from '../../components/loaders/RedirectingBox';

export const StyledLogin = styled.div`
  padding: 20px var(--padding-inline);
  display: flex;

  & > .box {
    width: 90%;
    min-width: min-content;
    max-width: 30rem;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .login-form {
    padding: 1.5rem 1.8rem;
    border-radius: 1rem;
    background-color: aliceblue;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sign-up-link {
    text-align: center;

    a {
      color: black;
    }
  }

  .custom-button,
  .google-button {
    margin: auto;
  }

  .reset-password {
    color: black;
    margin-block: -0.9rem;
    margin-left: auto;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  @media (max-width: ${screenWidths.phone}) {
    padding-inline: 0px;

    .box {
      gap: 1rem;
    }
  }
`;

function Login() {
  const queryClient = useQueryClient();
  const { isLoggingIn, login } = useLoginUser();
  const {
    isLoading: isLoadingCurrentUser,
    currentUser,
    refetch,
    isRefetching,
    isRefetchError,
    error,
  } = useCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({ resolver: zodResolver(CredentialSchema) });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirectTo');
  // console.log(redirectUrl);

  useTitle('StayEasy | Login');

  useEffect(() => {
    const catchMessage = (event: MessageEvent) => {
      if (event.data === AuthMessage.SUCCESS) {
        isRefetchedUser.current = true;
        refetch();
      } else {
        toast.error('Login failed');
      }
    };

    window.addEventListener('message', catchMessage);

    return () => window.removeEventListener('message', catchMessage);
  }, [refetch]);

  const isRefetchedUser = useRef(false);

  useEffect(() => {
    if (currentUser) {
      const redirectUrl = new URLSearchParams(window.location.search).get(
        'redirectTo'
      );
      if (getSubdomain() === Subdomain.MAIN) {
        if (isRefetchedUser.current) {
          toast.success('Successfully logged in');
        }
        navigate(redirectUrl ?? '/', { replace: true });
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
          window.location.replace('/auth');
        }
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (isRefetchError) {
      toast.error(error?.message ?? 'There was an unknown error logging in');
    }
  }, [isRefetchError, error]);

  const onSubmit: SubmitHandler<Credentials> = (data) => {
    login(data, {
      onSuccess: (userData) => {
        if (getSubdomain() === Subdomain.MAIN) {
          toast.success('Successfully logged in');
          queryClient.setQueryData(['current-user'], userData);
          navigate(redirectUrl ?? '/', { replace: true });
          return;
        }
        let redirectPath = '/auth';
        if (redirectUrl) {
          const redirectParam = new URLSearchParams();
          redirectParam.set('redirectTo', redirectUrl);
          redirectPath += `?${redirectParam.toString()}`;
        }
        window.location.replace(redirectPath);
      },
      onError: (error) => {
        if (error instanceof Exception) toast.error(error.message);
        else toast.error('There was some error logging in.');
      },
    });
  };

  const isBeingLoggedIn = isLoggingIn || isRefetching;

  return (
    <StyledLogin>
      {isLoadingCurrentUser ? (
        <Spinner />
      ) : currentUser ? (
        <>
          {getSubdomain() !== Subdomain.MAIN && (
            <RedirectingBox text="Redirecting..." />
          )}
        </>
      ) : (
        <div className="box">
          <h1>{redirectUrl ? 'Login to continue' : 'Login'}</h1>
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
                defaultValue='johndoe@test.com'
                disabled={isBeingLoggedIn}
                {...register('email')}
              />
            </div>
            <div className="form-row">
              <Label>
                {errors?.password?.message ? (
                  <Error data={errors.password.message} />
                ) : (
                  'Password'
                )}
              </Label>
              <Input
                type="password"
                id="password"
                defaultValue='secret'
                disabled={isBeingLoggedIn}
                {...register('password')}
              />
            </div>
            <Link
              className="reset-password"
              to={{ pathname: '/reset-password' }}
              replace={true}
            >
              Forgot password?
            </Link>
            <Button disabled={isBeingLoggedIn} type="submit">
              <SpinnerWithText
                isLoading={isBeingLoggedIn}
                text="Login"
                color="white"
              />
            </Button>
            <GoogleSignInButton
              disabled={isBeingLoggedIn}
              process="Sign in"
              type="button"
              className="google-button"
              onClick={authWithGoogle}
            />
            <p className="sign-up-link">
              Don't have an account?{' '}
              <Link
                to={{ pathname: '/signup', search: searchParams.toString() }}
                replace={true}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      )}
    </StyledLogin>
  );
}

export default Login;
