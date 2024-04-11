import styled from 'styled-components';
import { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import LoaderOverlay from '../../../components/loaders/LoaderOverlay';

const StyledLogoutButton = styled.a`
  cursor: pointer;
`;

interface Props {
  asType?: string;
}

const LogoutButton: React.FC<Props> = ({ asType }) => {
  const navigate = useNavigate();

  return (
    <>
      <StyledLogoutButton href="/logout">Logout</StyledLogoutButton>
      {/* {isLoggingOut && <LoaderOverlay />} */}
    </>
  );
};

export default LogoutButton;
