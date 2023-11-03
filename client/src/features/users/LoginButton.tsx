import { MouseEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCurrentUser } from './useCurrentUser';
import { StyledNavLink } from '../../ui/StykedNavLink';
import { BiSolidUser } from 'react-icons/bi';
import UserNavList from '../../ui/UserNavList';
import SpinnerWithText from '../../ui/loaders/SpinnerWithText';

const StyledLoginButton = styled.div`
  .login-text {
    width: min-content;
    position: relative;
    visibility: hidden;
  }

  .spinner,
  .user-icon {
    visibility: visible;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LoginButton: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setOpenMenu(false);
    }
  }, [currentUser]);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenu((curr) => !curr);
  };
  return (
    <StyledLoginButton>
      {currentUser ? (
        <>
          <StyledNavLink to="/profile" onClickCapture={handleClick}>
            <span className="login-text">
              Login
              <span className="user-icon">
                <BiSolidUser />
              </span>
            </span>
          </StyledNavLink>
          <UserNavList open={openMenu} setOpen={setOpenMenu} />
        </>
      ) : (
        <StyledNavLink to="/login">
          <SpinnerWithText text="Login" isLoading={isLoading} />
        </StyledNavLink>
      )}
    </StyledLoginButton>
  );
};

export default LoginButton;
