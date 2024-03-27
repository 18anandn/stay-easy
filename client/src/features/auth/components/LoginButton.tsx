import { MouseEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiSolidUser } from 'react-icons/bi';

import { useCurrentUser } from '../hooks/useCurrentUser';
import UserNavList from './UserNavList';
import SpinnerWithText from '../../../components/loaders/SpinnerWithText';
import { NavLink } from 'react-router-dom';
import { screenWidths } from '../../../components/ScreenContextProvider';

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

  button.nav-link {
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .user-nav-list {
    scale: 0.9;
    opacity: 0;

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-content: stretch;
      align-items: stretch;
    }

    a {
      display: block;
      text-decoration: none;
      color: #656b80;
    }
  }

  @media (min-width: ${screenWidths.phone}px) {
    .user-nav-list {
      height: min-content;
      width: auto;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 2;
      translate: -50% 2rem;
      scale: 0.9;
      opacity: 0;
      pointer-events: none;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: height 0.2s ease-out;
      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
      transition: scale 0.2s ease-in-out, opacity 0.2s ease-in-out;

      &.open {
        pointer-events: auto;
        opacity: 1;
        scale: 1;
      }

      ul {
        gap: 0.3rem;
        padding: 0.3rem 0.4rem;
        background-color: white;
      }

      a {
        text-align: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0.5rem;
        font-size: 1.1rem;
        border-radius: 0.4rem;

        &:hover {
          color: white;
          background-color: black;
        }
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    button.nav-link {
      display: none;
    }

    .user-nav-list {
      scale: 1;
      opacity: 1;
      transition: none;

      ul {
        a {
          display: block;
          padding: 1rem 1rem;
          font-size: 1rem;
          color: black;
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
      }
    }
  }
`;

const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setIsOpen(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const closeNavList = (event: MouseEvent) => {
      setIsOpen(false);
    };

    document.body.addEventListener('click', closeNavList);
  }, []);

  const handleClick: MouseEventHandler = (event) => {
    event.stopPropagation();
    if (isLoading) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <StyledLoginButton>
      {currentUser ? (
        <>
          <button
            onClickCapture={handleClick}
            type="button"
            className="nav-link"
          >
            <span className="login-text">
              Login
              <span className="user-icon">
                <BiSolidUser />
              </span>
            </span>
          </button>
          <div
            className={`user-nav-list ${isOpen ? 'open' : null}`}
          >
            <UserNavList />
          </div>
        </>
      ) : (
        <NavLink
          to="/login"
          className={`nav-link ${isLoading ? 'loading' : ''}`}
          onClick={(event) => {
            if (isLoading) event.preventDefault();
          }}
        >
          <SpinnerWithText text="Login" isLoading={isLoading} />
        </NavLink>
      )}
    </StyledLoginButton>
  );
};

export default LoginButton;
