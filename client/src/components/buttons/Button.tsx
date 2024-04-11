import styled, { css } from 'styled-components';

enum ButtonType {
  Normal = 'normal',
  Danger = 'danger',
}

type buttonTypeValues = `${ButtonType}`;

interface ButtonProps {
  $type?: buttonTypeValues;
}

const Button = styled.button.attrs({
  className: 'custom-button',
})<ButtonProps>`
  height: min-content;
  width: min-content;
  font-size: inherit;
  padding: 0.6rem 1rem;
  color: white;
  background-color: #007fff;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  white-space: nowrap;
  flex-grow: 0;
  flex-shrink: 0;
  cursor: pointer;

  ${(props) => {
    if (props.$type === ButtonType.Danger) {
      return css`
        background-color: red;
      `;
    }
  }}

  ${(props) => {
    if (props.disabled) {
      return css`
        background-color: #7cb9e8;
        cursor: not-allowed;
      `;
    }
  }}
`;

export default Button;
