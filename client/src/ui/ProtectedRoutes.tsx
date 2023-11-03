import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../features/users/useCurrentUser';
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

  if (!currentUser) {
    return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoutes;
