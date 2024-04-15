import { Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import SignUp from '../pages/auth/SignUp';
import OAuthLoginComplete from '../pages/auth/OAuthLoginComplete';
import UserVerificationPage from '../pages/auth/UserVerificationPage';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ReseUserPassword from '../pages/auth/ResetUserPassword';

export const Auth = (
  <>
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="reset-password">
      <Route index element={<ForgotPassword />} />
      <Route path=":userId" element={<ReseUserPassword />} />
    </Route>
    <Route path="verify/:userId" element={<UserVerificationPage />} />
    <Route path="login/:authstatus" element={<OAuthLoginComplete />} />
  </>
);
