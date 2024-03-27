import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import styled from 'styled-components';
import Loader from './loaders/Loader';

interface Props {
  children: ReactNode;
}

const Box = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15dvh;
`;

const ProtectedRoutes: React.FC<Props> = ({ children }) => {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();
  if (isLoading) {
    return (
      <Box>
        <Loader color="black" />
      </Box>
    );
  }

  if (!isLoading && !currentUser) {
    const redirectParam = new URLSearchParams();
    redirectParam.set('redirectTo', location.pathname + location.search);
    return <Navigate to={`/login?${redirectParam.toString()}`} replace />;
  }

  return children;
};

export default ProtectedRoutes;
