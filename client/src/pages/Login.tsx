import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { SubmitHandler, useForm } from 'react-hook-form';

import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Label from '../components/Label';
import Input from '../components/inputs/Input';
import Button from '../components/buttons/Button';
import Error from '../components/Error';
import Loader from '../components/loaders/Loader';
import SpinnerWithText from '../components/loaders/SpinnerWithText';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { useLoginUser } from '../features/auth/hooks/useLoginUser';
import { LoginCreds } from '../features/auth/types/LoginCreds';
import { Subdomain, getSubdomain } from '../utils/getSubdomain';
import { screenWidths } from '../providers/ScreenProvider';

const StyledLogin = styled.div`
  font-size: 1rem;
  display: flex;

  & > .box {
    width: 80%;
    max-width: 450px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
  }

  @media (max-width: ${screenWidths.phone}) {
    .box {
      gap: 1rem;
    }
  }
`;

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Login() {
  const { isLoggingIn, login } = useLoginUser();
  const { currentUser, isLoading } = useCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCreds>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirectTo');

  useEffect(() => {
    if (currentUser) {
      if (getSubdomain() === Subdomain.MAIN)
        navigate.length > 2 ? navigate(-1) : navigate('/', { replace: true });
      else {
        window.location.replace('/auth');
      }
    }
  }, [currentUser, navigate]);

  const onSubmit: SubmitHandler<LoginCreds> = (data) => {
    login(data, {
      onSuccess: () => {
        if (getSubdomain() === Subdomain.MAIN) {
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
    });
  };

  if (isLoading) {
    return (
      <StyledLogin>
        <Loader color="black" />
      </StyledLogin>
    );
  }

  return (
    <StyledLogin>
      <div className="box">
        <h1>{redirectUrl ? 'Login to continue' : 'Login'}</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <Label>Email</Label>
            <Input
              type="text"
              id="email"
              defaultValue={'test@test.com'}
              disabled={isLoggingIn}
              {...register('email', {
                required: {
                  value: true,
                  message: 'Enter your email address',
                },
                validate: (value) => {
                  if (!value.match(emailRegex)) {
                    return 'Enter valid email address';
                  }
                },
              })}
            />
            {errors?.email?.message && <Error data={errors.email.message} />}
          </FormRow>
          <FormRow>
            <Label>Password</Label>
            <Input
              type="password"
              id="password"
              defaultValue={'secret'}
              disabled={isLoggingIn}
              {...register('password', {
                required: {
                  value: true,
                  message: 'Password is required',
                },
              })}
            />
            {errors?.password?.message && (
              <Error data={errors.password.message} />
            )}
          </FormRow>
          <FormRow $align="center">
            <Button disabled={isLoggingIn}>
              <SpinnerWithText
                isLoading={isLoggingIn}
                text="Login"
                color="white"
              />
            </Button>
          </FormRow>
        </Form>
      </div>
    </StyledLogin>
  );
}

export default Login;
