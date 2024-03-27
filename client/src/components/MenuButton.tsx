import { MouseEventHandler } from 'react';
import styled from 'styled-components';

const StyledMenuButton = styled.button`
  height: 25px;
  aspect-ratio: 1.5;
  border: none;
  outline: none;
  background-color: transparent;
  position: relative;

  span {
    border-radius: 1000px;
    display: block;
    width: 80%;
    aspect-ratio: 7;
    background-color: black;
    position: absolute;
    left: 50%;
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out,
      top 0.2s ease-in-out;

    &.top {
      top: 0;
      transform: translate(-50%, 0);
    }

    &.middle {
      top: 50%;
      transform: translate(-50%, -50%);
    }

    &.bottom {
      top: 100%;
      transform: translate(-50%, -100%);
    }
  }

  &.open {
    span {
      &.top {
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &.middle {
        opacity: 0;
      }

      &.bottom {
        top: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
`;

type Props = {
  onClick: MouseEventHandler;
  isOpen: boolean;
};

const MenuButton: React.FC<Props> = ({ onClick, isOpen }) => {
  return (
    <StyledMenuButton
      className={`menu-button ${isOpen ? 'open' : null}`}
      onClick={onClick}
    >
      <span className="top"></span>
      <span className="middle"></span>
      <span className="bottom"></span>
    </StyledMenuButton>
  );
};

export default MenuButton;
