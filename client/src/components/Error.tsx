import styled from 'styled-components';

const StyledError = styled.p`
  color: red;
`;

interface ErrorProps {
  data: string
}

const Error: React.FC<ErrorProps> = ({data}) => {
  return <StyledError>{data}</StyledError>;
};

export default Error;
