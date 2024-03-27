import { MouseEventHandler, useState } from 'react';
import styled from 'styled-components';

const StyledToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  width: max-content;

  p {
    white-space: nowrap;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
  button {
    font-size: 1em;
    height: 2em;
    width: 3.5em;
    /* padding: 2rem 1rem; */
    border-radius: 1000em;
    border: none;
    outline: none;
    background-color: #d3d3d3;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s ease;

    .ball {
      display: block;
      height: 75%;
      aspect-ratio: 1;
      border-radius: 1000em;
      position: absolute;
      top: 50%;
      left: 0.35em;
      transform: translate(0, -50%);
      background-color: white;
      transition:
        left 0.2s ease,
        right 0.2s ease;
    }

    &.button-on {
      background-color: #007fff;
      .ball {
        left: 1.62em;
        /* right: 6%; */
      }
    }
  }
`;

type Props = {
  label?: string;
  id?: string;
  defaultVal?: boolean;
  onChange: (val: boolean) => void;
};

const ToggleButton: React.FC<Props> = ({ label, id, defaultVal, onChange }) => {
  const [isOn, setIsOn] = useState<boolean>(defaultVal ?? false);

  const handleToggle: MouseEventHandler = () => {
    onChange(!isOn);
    setIsOn(!isOn);
  };

  return (
    <StyledToggleButton className="toggle-button">
      {label && label.length > 0 && <p>{label}</p>}
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        className={isOn ? 'button-on' : ''}
      >
        <span className="ball"></span>
      </button>
    </StyledToggleButton>
  );
};

export default ToggleButton;
