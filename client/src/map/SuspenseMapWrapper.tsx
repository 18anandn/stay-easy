import { ReactNode, Suspense } from 'react';
import styled from 'styled-components';
import MapDotLoader from '../components/loaders/MapDotLoader';

const StyledSuspenseMapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

type Props = {
  children: ReactNode;
};

const SuspenseMapWrapper: React.FC<Props> = ({ children }) => {
  return (
    <StyledSuspenseMapWrapper>
      <Suspense fallback={<MapDotLoader />}>{children}</Suspense>
    </StyledSuspenseMapWrapper>
  );
};

export default SuspenseMapWrapper;
