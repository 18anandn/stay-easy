import Cookies from 'js-cookie';

import { LoginCreds, LoginRes, ServerError } from '../commonDataTypes';

export async function loginUser(body: LoginCreds): Promise<LoginRes> {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError(data.message, res.status);
  }

  return data;
}

export async function getCurrentUser(): Promise<LoginRes | null> {
  if (!Cookies.get('loggedIn')) {
    return null;
  }
  const res = await fetch('/api/v1/user', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });

  const data = await res.json();

  if (!res.ok) {
    return null;
  }

  return data;
}

export async function logoutUser(): Promise<void> {
  const res = await fetch('/api/v1/auth/logout', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError(data.message, res.status);
  }
}
