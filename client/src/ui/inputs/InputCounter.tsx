import styled from 'styled-components';
import Input from './Input';
import {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const StyledInputCounter = styled.div`
  /* transform: scale(80%); */
  display: flex;
  height: 2rem;
  width: 6rem;

  & > * {
    flex: 1 1 0;
  }

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
    padding-left: 0;
    padding-right: 0;
    outline: none;
    border-radius: 0;

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
    /* width: 2.5rem; */
    font-size: 1.1rem;
    color: white;
    background-color: #4681f4;
    cursor: pointer;
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
  onValChange: (val: number) => void;
} & Omit<
  React.ComponentPropsWithRef<'input'>,
  'type' | 'onChange' | 'min' | 'max'
>;

const InputCounter: React.FC<Props> = forwardRef(
  ({ min, max, onValChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<number | ''>(min);
    const innerRef = useRef<HTMLInputElement>(document.createElement('input'));

    useImperativeHandle<HTMLInputElement, HTMLInputElement>(
      ref,
      () => innerRef.current,
    );

    useEffect(() => {
      const currVal = parseInt(innerRef.current.value);
      if (isNaN(currVal)) {
        setInputValue(min);
        onValChange(min);
      } else {
        setInputValue(currVal);
        onValChange(currVal);
      }
    }, [min, onValChange]);
    const increaseCounter: MouseEventHandler<HTMLButtonElement> = (event) => {
      const val = parseInt(innerRef.current.value);
      if (val === max) {
        return;
      }
      setInputValue(() => {
        const newVal = val + 1;
        onValChange(newVal);
        return newVal;
      });
    };

    const decreaseCounter: MouseEventHandler<HTMLButtonElement> = (event) => {
      const val = parseInt(innerRef.current.value);
      if (val === min) {
        return;
      }
      setInputValue(() => {
        const newVal = val - 1;
        onValChange(newVal);
        return newVal;
      });
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
        <button className="left-button" onClick={decreaseCounter} type="button">
          &minus;
        </button>
        <Input
          ref={innerRef}
          type="number"
          // defaultValue={min}
          value={inputValue}
          // step={1}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        <button
          className="right-button"
          onClick={increaseCounter}
          type="button"
        >
          +
        </button>
      </StyledInputCounter>
    );
  },
);

export default InputCounter;
