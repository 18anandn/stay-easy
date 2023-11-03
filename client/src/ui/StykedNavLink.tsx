import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const StyledNavLink = styled(NavLink)`
  padding: 0.8rem;
  font-size: 1.1rem;
  color: black;
  /* opacity: 0.5; */
  letter-spacing: 0.1rem;
  text-decoration: none;
  border-bottom: 0.2rem solid transparent;
  /* border-radius: 0.8rem; */
  transition: all 0.4s ease;

  &.active {
    border-bottom-color: black;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  &:hover {
    border-bottom-color: black;
  }
`;