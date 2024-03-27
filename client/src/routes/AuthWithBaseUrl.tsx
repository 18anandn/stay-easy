import { Navigate, Route } from 'react-router-dom';
import { Auth } from './Auth';

export const AuthWithBaseUrl = (
  <>
    <Route index element={<Navigate to={'login'} />} />
    {Auth}
  </>
);
