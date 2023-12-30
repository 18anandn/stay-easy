import styled from 'styled-components';
import { useLogout } from './useLogout';
import { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import LoaderOverlay from '../../ui/loaders/LoaderOverlay';

const StyledLogoutButton = styled.button`
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
      <StyledLogoutButton as={asType ?? 'button'} onClick={handleClick}>
        Logout
      </StyledLogoutButton>
      {isLoggingOut && <LoaderOverlay />}
    </>
  );
};

export default LogoutButton;
