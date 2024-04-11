import { useEffect, useLayoutEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillDashboard, AiFillHome } from 'react-icons/ai';
import { FaTableList } from 'react-icons/fa6';
import { DiGoogleAnalytics } from 'react-icons/di';
import { RiLogoutBoxLine } from 'react-icons/ri';
import {
  ScreenType,
  screenWidths,
  useScreen,
} from '../../providers/ScreenProvider';
import classNames from 'classnames';

const StyledOwnerNavBar = styled.div`
  width: var(--owner-nav-width);
  box-sizing: border-box;
  display: flex;
  align-items: start;
  background-color: #3b444b;

  &.allow-transition {
    transition: margin-left 200ms linear;
  }

  &.closed {
    margin-left: calc(-1 * var(--owner-nav-width) + var(--owner-button-width));

    .arrow {
      transform: rotate(-180deg);
    }
  }

  nav {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 100svh;
    position: sticky;
    top: 0;
    bottom: 0;

    .logout-button {
      padding: 1rem 0.4rem;
      margin-top: auto;
    }

    & > .list-wrapper {
      flex: 1 0 auto;
    }

    ul {
      position: sticky;
      top: 0;
      padding: 1rem 0.4rem;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      /* background-color: red; */
      /* gap: 0.5rem; */
    }

    li {
      &:last-child {
        margin-top: auto;
      }
    }

    a {
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #f5f4f5;
      text-decoration: none;
      transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out;
      border-radius: 0.5rem;

      &:hover,
      &.active {
        color: #343334;
        background-color: #f5f4f5;
      }

      .icon {
        height: min-content;
        font-size: 1.5rem;
        vertical-align: bottom;
        position: relative;
        top: 0.2rem;
      }
    }
  }

  button {
    position: sticky;
    top: 0;
    height: 100svh;
    flex: 0 0 auto;
    width: var(--owner-button-width);
    cursor: pointer;
    outline: none;
    /* box-sizing: border-box; */
    border: none;
    /* position: relative; */
    /* border: 1px solid blue; */
    display: block;
    background-color: transparent;
    align-items: center;
    justify-content: center;

    .arrow {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      /* transition: transform 0.2s ease-out; */

      span {
        width: 70%;
        aspect-ratio: 1;
        box-sizing: border-box;
        position: absolute;
        left: 65%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 3px solid #f5f4f5;
        border-right: none;
        border-top: none;
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }
  }

  @media (max-width: ${screenWidths.tab}px) {
    position: fixed;
    z-index: 2;
    top: 0;
    bottom: 0;
  }
`;

const OwnerNavBar: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const location = useLocation();
  const [allowTransition, setAllowTransition] = useState(false);

  const screen = useScreen();

  useLayoutEffect(() => {
    if (screen === ScreenType.TAB || screen === ScreenType.PHONE) {
      setIsNavbarOpen(false);
    }
  }, [screen]);

  useEffect(() => {
    setAllowTransition(true);
  }, []);

  useEffect(() => {
    if (screen === ScreenType.TAB || screen === ScreenType.PHONE) {
      setIsNavbarOpen(false);
    }
  }, [screen, location.pathname]);

  const navBarClasses = classNames({
    closed: !isNavbarOpen,
    'allow-transition': allowTransition,
  });

  return (
    <StyledOwnerNavBar className={navBarClasses}>
      <nav>
        <div className="list-wrapper">
          <ul>
            <li>
              <NavLink to="/">
                <span className="icon">
                  <AiFillHome />
                </span>
                <span className="text">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink end to="">
                <span className="icon">
                  <AiFillDashboard />
                </span>
                <span className="text">Dashbord</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="bookings">
                <span className="icon">
                  <FaTableList />
                </span>
                <span className="text">Bookings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="analytics">
                <span className="icon">
                  <DiGoogleAnalytics />
                </span>
                <span className="text">Analytics</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="logout-button">
          <a href="/logout">
            <span className="icon">
              <RiLogoutBoxLine />
            </span>
            <span className="text">Log out</span>
          </a>
        </div>
      </nav>
      <button
        type="button"
        onClick={() => {
          setIsNavbarOpen((prev) => !prev);
        }}
      >
        <span className="arrow">
          <span></span>
        </span>
      </button>
    </StyledOwnerNavBar>
  );
};

export default OwnerNavBar;
