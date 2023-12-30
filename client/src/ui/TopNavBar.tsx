import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../assets/logo.png';
import { StyledNavLink } from './StykedNavLink';
import LoginButton from '../features/users/LoginButton';

const StyledTopNavBar = styled.nav`
  white-space: nowrap;
  --top-bottom-padding: 1.4rem;
  padding: var(--top-bottom-padding) 5rem var(--top-bottom-padding) 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(211, 211, 211);
`;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1.5rem;
`;

const StyledLi = styled.li`
  &.profile-button {
    position: relative;
  }
`;

const StyledImg = styled.img`
  height: 2.5rem;
  /* padding: 0.5rem;
  border-radius: 0.9rem;
  background-color: white; */
`;

const TopNavBar: React.FC = () => {
  const location = useLocation();

  return (
    <StyledTopNavBar>
      <Link to="/">
        <StyledImg src={logo} />
      </Link>
      {!location.pathname.startsWith('/book') && (
        <StyledUl>
          <StyledLi>
            <StyledNavLink to="/all-homes">All Homes</StyledNavLink>
          </StyledLi>
          <StyledLi>
            <StyledNavLink to="/search">Search</StyledNavLink>
          </StyledLi>
          <StyledLi>
            <StyledNavLink to="/register">Register Your Home</StyledNavLink>
          </StyledLi>
          <StyledLi className="profile-button">
            <LoginButton />
          </StyledLi>
        </StyledUl>
      )}
    </StyledTopNavBar>
  );
};

export default TopNavBar;
