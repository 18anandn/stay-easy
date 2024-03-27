import styled, { css } from 'styled-components';

enum Alignment {
  Normal = 'normal',
  Center = 'center',
}

type alignmentValues = `${Alignment}`;

interface FormRowProps {
  $align?: alignmentValues;
}

const FormRow = styled.div<FormRowProps>`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  ${(props) => {
    if (props.$align === Alignment.Center)
      return css`
        display: flex;
        align-items: center;
        justify-content: center;
      `;
  }}
`;

export default FormRow;
