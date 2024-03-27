import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';

import logo from '../assets/logo.png';
import LoginButton from '../features/auth/components/LoginButton';
import {
  ScreenContext,
  ScreenType,
  screenWidths,
} from '../components/ScreenContextProvider';
import MenuButton from '../components/MenuButton';
import { useContext, useEffect } from 'react';
import { MenuContext } from '../components/MenuContextProvider';
import { useShowNavBar } from '../features/nav-bar-scroll/hooks/useShowNavBar';

const StyledTopNavBar = styled.nav`
  height: var(--top-navbar-height);
  background-color: white;

  .back-drop {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    display: none;
  }

  .nav-bar {
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    /* right: 0; */
    right: calc(1 * var(--scrollbar-width, 0px));
    z-index: 5;
    transition: translate 0.2s ease-in-out;

    &.hide {
      translate: 0 -100%;
    }
  }

  .nav-bar {
    height: var(--top-navbar-height);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 5%;
    white-space: nowrap;
    --top-bottom-padding: 1.4rem;
    border-bottom: 1px solid rgb(211, 211, 211);
    background-color: white;
    /* background-color: transparent; */
  }

  img {
    height: 2.5rem;
  }

  .menu-button {
    display: none;
  }

  .top-menu {
    margin-left: auto;
    box-sizing: border-box;
    list-style-type: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    li {
      &.profile-button {
        position: relative;
      }

      &.home-link {
        margin-right: auto;
      }
    }
  }

  .nav-link {
    display: block;
    padding: 1rem 1rem;
    font-size: 1rem;
    color: black;
    /* opacity: 0.5; */
    letter-spacing: 0.1rem;
    text-decoration: none;
    border-bottom: 0.2rem solid transparent;
    /* border-radius: 0.8rem; */
    transition: border-bottom 0.4s ease;

    &.active {
      border-bottom-color: black;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }

    &:hover:not(.loading) {
      border-bottom-color: black;
    }
  }

  @media (max-width: ${screenWidths.tab}px) {
    .top-menu {
      gap: 0.2rem;

      li {
        .nav-link {
          padding: 0.8rem;
        }
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    img {
      height: 2rem;
    }

    .menu-button {
      display: inherit;
      margin-left: auto;
    }

    .back-drop {
      display: block;
      z-index: 5;
      opacity: 0;
      pointer-events: none;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.2s ease-in-out;

      &.show {
        pointer-events: auto;
        opacity: 1;
      }
    }

    .top-menu {
      height: calc(100dvh - var(--top-navbar-height));
      padding: 1rem;
      box-sizing: border-box;
      position: fixed;
      right: 0;
      top: var(--top-navbar-height);
      flex-direction: column;
      align-items: start;
      transform: translateX(100%);
      transition: translate 0.2s ease-in-out;
      background-color: white;
      /* border-radius: 1rem 0 0 1rem; */
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

      &.open {
        translate: -100%;
      }
    }
  }
`;

const TopNavBar: React.FC = () => {
  const location = useLocation();
  const { isSideMenuOpen, setIsSideMenuOpen } = useContext(MenuContext);
  const { screen } = useContext(ScreenContext);
  const { parentRef, isNavBarOpen } = useShowNavBar();

  const { pathname } = useLocation();
  useEffect(() => {
    setIsSideMenuOpen(false);
  }, [setIsSideMenuOpen, pathname]);

  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }
  }, [isSideMenuOpen]);

  useEffect(() => {
    if (screen === ScreenType.DESKTOP) {
      setIsSideMenuOpen(false);
    }
  }, [screen, setIsSideMenuOpen]);

  const navBarClasses = classNames({
    'nav-bar': true,
    hide:
      !isNavBarOpen &&
      (!location.pathname.startsWith('/search') || screen === ScreenType.PHONE),
  });

  const backDropClasses = classNames({
    'back-drop': true,
    show: isSideMenuOpen,
  });

  return (
    <StyledTopNavBar ref={parentRef}>
      <div
        className={backDropClasses}
        onClick={() => setIsSideMenuOpen(false)}
      ></div>
      <div className={navBarClasses}>
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
        <MenuButton
          isOpen={isSideMenuOpen}
          onClick={() => {
            setIsSideMenuOpen((prev) => !prev);
          }}
        />
        {!location.pathname.startsWith('/book') && (
          <ul className={`top-menu ${isSideMenuOpen ? 'open' : null}`}>
            <li>
              <NavLink to="/all-homes" className="nav-link">
                All Homes
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" className="nav-link">
                Search
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="nav-link">
                Register Your Home
              </NavLink>
            </li>
            <li className="profile-button">
              <LoginButton />
            </li>
          </ul>
        )}
      </div>
    </StyledTopNavBar>
  );
};

export default TopNavBar;
