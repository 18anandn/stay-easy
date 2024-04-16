import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSetMenu } from '../../../providers/MenuProvider';
import SpinnerOverlay from '../../../components/loaders/SpinnerOverlay';

const StyledLogoutButton = styled.button.attrs({ as: 'a' })`
  cursor: pointer;
`;

interface Props {
  asType?: string;
}

const LogoutButton: React.FC<Props> = () => {
  const navigate = useNavigate();
  const setIsSideMenuOpen = useSetMenu();
  const queryClient = useQueryClient();
  const { isPending: isLoggingOut, mutate: logout } = useLogout();

  const handleClick = () => {
    setIsSideMenuOpen(false);
    logout(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
        queryClient.clear();
        navigate('/', { replace: true });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <StyledLogoutButton onClick={handleClick}>Logout</StyledLogoutButton>
      {isLoggingOut && <SpinnerOverlay />}
    </>
  );
};

export default LogoutButton;
