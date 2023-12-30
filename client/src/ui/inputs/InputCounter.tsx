import styled from 'styled-components';
import Input from './Input';
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from 'react';

const StyledInputCounter = styled.div`
  /* transform: scale(80%); */
  display: flex;
  height: 2rem;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
  initialValue?: number;
  onValChange: (val: number) => void;
} & React.ComponentPropsWithoutRef<'input'>;

const InputCounter: React.FC<Props> = ({
  min,
  max,
  initialValue,
  onValChange,
  name,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<number | ''>(
    initialValue ?? min,
  );
  const innerRef = useRef<HTMLInputElement>(document.createElement('input'));

  // useImperativeHandle<HTMLInputElement, HTMLInputElement>(
  //   ref,
  //   () => innerRef.current,
  // );

  // useEffect(() => {
  //   const currVal = parseInt(innerRef.current.value);
  //   if (isNaN(currVal)) {
  //     setInputValue(min);
  //     onValChange(min);
  //   } else {
  //     setInputValue(currVal);
  //     onValChange(currVal);
  //   }
  // }, [min, onValChange]);
  const increaseCounter: MouseEventHandler<HTMLButtonElement> = (event) => {
    const val = parseInt(innerRef.current.value);
    if (val === max) {
      return;
    }
    const newVal = val + 1;
    setInputValue(() => {
      return newVal;
    });
    onValChange(newVal);
  };

  const decreaseCounter: MouseEventHandler<HTMLButtonElement> = (event) => {
    const val = parseInt(innerRef.current.value);
    if (val === min) {
      return;
    }
    const newVal = val - 1;
    setInputValue(() => {
      return newVal;
    });
    onValChange(newVal);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const val = innerRef.current.value;
    const num = parseInt(val);
    if (val === '') {
      setInputValue('');
      return;
    }
    if (isNaN(num)) {
      setInputValue(inputValue);
      return;
    }
    if (num > max) {
      setInputValue(max);
      return;
    }
    if (num < min) {
      setInputValue(min);
      return;
    }
    setInputValue(num);
    onValChange(num);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const val = parseInt(innerRef.current.value);
    if (isNaN(val)) {
      setInputValue(() => {
        const newVal = inputValue === '' ? min : inputValue;
        onValChange(newVal);
        return newVal;
      });
      return;
    }
    if (val > max) {
      setInputValue(() => {
        onValChange(max);
        return max;
      });
      return;
    }
    if (val < min) {
      setInputValue(() => {
        onValChange(min);
        return min;
      });
      return;
    }
  };

  return (
    <StyledInputCounter>
      <button
        className="left-button"
        onClick={decreaseCounter}
        type="button"
        disabled={inputValue === min}
      >
        &minus;
      </button>
      <Input
        name={name}
        ref={innerRef}
        type="number"
        value={inputValue}
        // step={1}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly
      />
      <button
        disabled={inputValue === max}
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
