import styled from 'styled-components';
import { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout';
import LoaderOverlay from '../../../components/loaders/LoaderOverlay';

const StyledLogoutButton = styled.a`
  cursor: pointer;
`;

interface Props {
  asType?: string;
}

const LogoutButton: React.FC<Props> = ({ asType }) => {
  const { isLoggingOut, logout } = useLogout();
  const navigate = useNavigate();

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    logout(undefined, {
      onSettled: () => {
        navigate('/');
      },
    });
  };

  return (
    <>
      <StyledLogoutButton href="/logout">Logout</StyledLogoutButton>
      {isLoggingOut && <LoaderOverlay />}
    </>
  );
};

export default LogoutButton;
