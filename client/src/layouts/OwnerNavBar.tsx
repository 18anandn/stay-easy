import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillDashboard, AiFillHome } from 'react-icons/ai';
import { FaTableList } from 'react-icons/fa6';
import { DiGoogleAnalytics } from 'react-icons/di';
import { RiLogoutBoxLine } from 'react-icons/ri';

const StyledOwnerNavBar = styled.div`
  --nav-width: 250px;
  --button-width: 25px;
  width: var(--nav-width);
  height: 100dvh;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  display: flex;
  /* align-items: start; */
  transition-property: margin-left;
  transition-timing-function: ease-in-out;
  background-color: #3b444b;

  &.closed {
    margin-left: calc(-1 * var(--nav-width) + var(--button-width));

    .arrow {
      transform: rotate(-180deg);
    }
  }

  nav {
    padding: 1rem 0.4rem;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;

    .logout-button {
      margin-top: auto;
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

      &:hover {
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

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      /* gap: 0.5rem; */
    }

    li {
      &:last-child {
        margin-top: auto;
      }
    }
  }

  button {
    align-self: stretch;
    flex: 0 0 auto;
    width: var(--button-width);
    cursor: pointer;
    outline: none;
    /* box-sizing: border-box; */
    border: none;
    position: relative;
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
`;

const TRANSITION_DURATION = 200;

const OwnerNavBar: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const allowTransition = useRef(false);

  return (
    <StyledOwnerNavBar
      className={isNavbarOpen ? '' : 'closed'}
      style={{ transitionDuration: TRANSITION_DURATION + 'ms' }}
      onMouseOver={() => {
        if (!isNavbarOpen && allowTransition.current) {
          setIsNavbarOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (isNavbarOpen && allowTransition.current) {
          setIsNavbarOpen(false);
        }
      }}
    >
      <nav>
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
            <NavLink to="">
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
          if (isNavbarOpen) {
            setIsNavbarOpen(false);
            allowTransition.current = false;
            window.setTimeout(() => {
              allowTransition.current = true;
            }, TRANSITION_DURATION);
          } else {
            setIsNavbarOpen(true);
            allowTransition.current = false;
            window.setTimeout(() => {
              allowTransition.current = true;
            }, TRANSITION_DURATION);
          }
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
