import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Spinner from '../../components/loaders/Spinner';
const MapWithMarker = lazy(() => import('./MapWithMarker'));

const StyledMapContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d3d3d3;
`;

type Props = {
  location: [number, number] | { lat: number; lng: number };
};

const LazyMapWithMarker: React.FC<Props> = ({ location }) => {
  const [showMap, setShowMap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowMap(true);
      }
    });

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <StyledMapContainer ref={containerRef}>
      {showMap && (
        <Suspense fallback={<Spinner color="white" />}>
          <MapWithMarker location={location} />
        </Suspense>
      )}
    </StyledMapContainer>
  );
};

export default LazyMapWithMarker;
