import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../assets/logo.png';
import { StyledNavLink } from './StykedNavLink';
import LoginButton from '../features/users/LoginButton';

const StyledTopNavBar = styled.nav`
  white-space: nowrap;
  padding: 1rem 2rem 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

  return (
    <StyledTopNavBar>
      <Link to="/">
        <StyledImg src={logo} />
      </Link>
      <StyledUl>
        <StyledLi>
          <StyledNavLink to="/explore">Explore</StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/search">Book Rooms</StyledNavLink>
        </StyledLi>
        <StyledLi>
          <StyledNavLink to="/register">Register Your Home</StyledNavLink>
        </StyledLi>
        <StyledLi className="profile-button">
          <LoginButton />
        </StyledLi>
      </StyledUl>
    </StyledTopNavBar>
  );
};

export default TopNavBar;
