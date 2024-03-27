import styled from 'styled-components';

const Input = styled.input.attrs({
  className: 'styled-input',
})`
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  border: none;
  border-radius: 0.5rem;
  outline: none;
  width: 100%;
  font-size: 1rem;
  text-overflow: ellipsis;
  box-shadow:
    rgba(17, 17, 26, 0.05) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 0px 8px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:read-only {
    background-color: #e9ecef;
  }

  &:focus:not(:read-only) {
    outline: 3px solid blue;
  }
`;

export default Input;
