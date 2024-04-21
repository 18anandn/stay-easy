import { Navigate, Route } from 'react-router-dom';
import { Auth } from './Auth';

import { lazy } from 'react';

const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));

export const AuthWithBaseUrl = (
  <>
    <Route index element={<Navigate to={'login'} replace />} />
    {Auth}
    <Route path="privacy" element={<Privacy />} />
    <Route path="terms" element={<Terms />} />
  </>
);
