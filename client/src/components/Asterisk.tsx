import styled from 'styled-components';

const StyledAsterisk = styled.span`
  color: red;
`;

const Asterisk: React.FC = () => {
  return <StyledAsterisk>*</StyledAsterisk>;
};

export default Asterisk;
