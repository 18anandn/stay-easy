import styled from 'styled-components';
import React, { MouseEventHandler } from 'react';

const StyledInputCounter = styled.div`
  /* transform: scale(80%); */
  display: flex;
  height: 2rem;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  /* input[type='number'] {
    -moz-appearance: textfield;
  } */

  input {
    /* width: 3rem; */
    width: 2rem;
    padding-left: 0;
    padding-right: 0;
    outline: none;
    border-radius: 0;
    font-size: 1rem;
    cursor: default;

    &:focus {
      outline: none;
    }
  }

  input,
  button {
    text-align: center;
    border: none;
    outline: none;
  }

  button {
    width: 2rem;
    font-size: 1.1rem;
    color: white;
    background-color: #4681f4;
    cursor: pointer;

    &:disabled,
    &[disabled] {
      background-color: #7cb9e8;
      cursor: not-allowed;
    }
  }

  --radius: 50%;

  .left-button {
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }

  .right-button {
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }
`;

type Props = {
  min: number;
  max: number;
  value: number;
  onValChange: (val: number) => void;
  name: string;
};

const InputCounter: React.FC<Props> = ({
  min,
  max,
  value,
  onValChange,
  name,
}) => {
  const increaseCounter: MouseEventHandler<HTMLButtonElement> = () => {
    if (value < max) onValChange(value + 1);
  };

  const decreaseCounter: MouseEventHandler<HTMLButtonElement> = () => {
    if (value > min) onValChange(value - 1);
  };

  return (
    <StyledInputCounter>
      <button
        className="left-button"
        onClick={decreaseCounter}
        type="button"
        disabled={value === min}
      >
        &minus;
      </button>
      <input name={name} id={name} type="number" value={value} readOnly />
      <button
        disabled={value === max}
        className="right-button"
        onClick={increaseCounter}
        type="button"
      >
        +
      </button>
    </StyledInputCounter>
  );
};

export default InputCounter;
