import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';

import logo from '../assets/logo.png';
import LoginButton from '../features/auth/components/LoginButton';
import {
  ScreenType,
  screenWidths,
  useScreen,
} from '../providers/ScreenProvider';
import MenuButton from '../components/MenuButton';
import { MenuProvider, useMenu } from '../providers/MenuProvider';
import { useShowNavBarWithRef } from '../features/nav-bar-scroll/useShowNavBarWithRef';

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
    box-sizing: border-box;
    white-space: nowrap;
    --top-bottom-padding: 1.4rem;
    border-bottom: 1px solid rgb(211, 211, 211);
    background-color: white;
    /* background-color: transparent; */

    .content-container {
      height: 100%;
      /* max-width: var(--max-page-width); */
      padding-inline: var(--padding-inline);
      margin: auto;
      display: flex;
      align-items: center;
    }
  }

  .logo {
    width: min-content;
    height: 100%;
    display: flex;
    place-items: center;

    img {
      height: 60%;
    }
  }

  .menu-button {
    display: none;
  }

  .top-menu {
    width: 29rem;
    margin-left: auto;
    box-sizing: border-box;
    list-style-type: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;

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
    padding: 0.8rem;
    font-size: 1rem;
    color: black;
    /* opacity: 0.5; */
    letter-spacing: 0.05rem;
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

  /* @media (max-width: ${screenWidths.tab}px) {
    .top-menu {
      gap: 0.2rem;

      li {
        .nav-link {
          padding: 0.8rem;
        }
      }
    }
  } */

  /* @media (max-width: ${screenWidths.phone}px) { */

  @media (max-width: ${screenWidths.phone}px) {
    --padding-inline: var(--padding-inline-small);
  }

  @media (max-width: 50rem) {
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
      width: auto;
      padding: 1rem;
      box-sizing: border-box;
      position: fixed;
      right: 0;
      top: var(--top-navbar-height);
      bottom: 0;
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useMenu();
  const screen = useScreen();
  const { parentRef, isNavBarOpen } = useShowNavBarWithRef();

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

  const topMenuClasses = classNames({
    'top-menu': true,
    open: isSideMenuOpen,
  });

  return (
    <>
      <MenuProvider />
      <StyledTopNavBar ref={parentRef}>
        <div
          className={backDropClasses}
          onClick={() => setIsSideMenuOpen(false)}
        ></div>
        <div className={navBarClasses}>
          <div className="content-container">
            <Link to="/" className="logo">
              <img src={logo} alt="" />
            </Link>
            {!location.pathname.startsWith('/book') && (
              <>
                <MenuButton
                  isOpen={isSideMenuOpen}
                  onClick={() => {
                    setIsSideMenuOpen((prev) => !prev);
                  }}
                />
                <ul className={topMenuClasses}>
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
              </>
            )}
          </div>
        </div>
      </StyledTopNavBar>
    </>
  );
};

export default TopNavBar;
