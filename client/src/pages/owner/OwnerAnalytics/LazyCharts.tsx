import { Suspense, lazy } from 'react';
import styled from 'styled-components';
import { AnalyticsData } from '../../../features/owner/types/AnalyticsData';
import Spinner from '../../../components/loaders/Spinner';

const Charts = lazy(() => import('./Charts'));

const StyledLazyCharts = styled.div`
  min-height: 60px;

  .custom-spinner {
    margin: auto;
    height: min-content;
    font-size: 0.7px;
    position: static;
  }
`;

type Props = {
  data: AnalyticsData | undefined;
  isLoading: boolean;
};

const LazyCharts: React.FC<Props> = ({ data, isLoading }) => {
  return (
    <StyledLazyCharts>
      <Suspense fallback={isLoading ? undefined : <Spinner />}>
        <Charts data={data} />
      </Suspense>
    </StyledLazyCharts>
  );
};

export default LazyCharts;
