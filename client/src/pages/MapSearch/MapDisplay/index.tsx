import { Suspense, lazy } from 'react';
import CustomMapContainer from './CustomMapContainer';
import DotLoader from '../../../components/loaders/DotLoader';

const MapComponent = lazy(() => import('./MapComponent'));

const index: React.FC = () => {
  return (
    <CustomMapContainer>
      <Suspense fallback={<DotLoader />}>
        <MapComponent />
      </Suspense>
    </CustomMapContainer>
  );
};

export default index;
