import styled from 'styled-components';

const Input = styled.input.attrs({
  className: 'styled-input',
})`
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  box-sizing: border-box;
  border: none;
  border-radius: 0.5rem;
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: 3px solid blue;
  }
`;

export default Input;
