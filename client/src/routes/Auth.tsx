import { Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

export const Auth = (
  <>
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<SignUp />} />
  </>
); 