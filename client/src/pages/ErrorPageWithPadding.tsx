import styled from 'styled-components';
import ErrorPage from './ErrorPage';
import { ComponentProps } from 'react';

const StyledErrorPageWithPadding = styled.div`
  padding: 30px 8%;
`;

type Props = ComponentProps<typeof ErrorPage>;

const ErrorPageWithPadding: React.FC<Props> = (props) => {
  return (
    <StyledErrorPageWithPadding>
      <ErrorPage {...props} />
    </StyledErrorPageWithPadding>
  );
};

export default ErrorPageWithPadding;
