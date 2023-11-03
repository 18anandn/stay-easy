import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { SubmitHandler, useForm } from 'react-hook-form';

import Form from '../ui/Form';
import Heading from '../ui/Heading';
import FormRow from '../ui/FormRow';
import Label from '../ui/Label';
import Input from '../ui/inputs/Input';
import useLoginUser from '../features/users/useLoginUser';
import Button from '../ui/Button';
import Error from '../ui/Error';
import { useCurrentUser } from '../features/users/useCurrentUser';
import Loader from '../ui/loaders/Loader';
import SpinnerWithText from '../ui/loaders/SpinnerWithText';
import { useEffect } from 'react';
import { LoginCreds } from '../commonDataTypes';

const StyledLogin = styled.div`
  /* box-sizing: border-box; */
  font-size: 1.3rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 2px solid red; */
`;

const Box = styled.div`
  width: 30%;
  margin: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  /* border: 1px solid black; */
`;

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Login() {
  const { isLoggingIn, loginFn } = useLoginUser();
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
      navigate.length > 2 ? navigate(-1) : navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const onSubmit: SubmitHandler<LoginCreds> = (data) => {
    loginFn(data, {
      onSuccess: () => {
        navigate(redirectUrl ?? '/', { replace: true });
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
      <Box>
        <Heading>{redirectUrl ? 'Login to continue' : 'Login'}</Heading>
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
      </Box>
    </StyledLogin>
  );
}

export default Login;
