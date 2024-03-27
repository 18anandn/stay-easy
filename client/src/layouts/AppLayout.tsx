import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './Footer';
import { ReactNode, Suspense, useEffect } from 'react';
import Loader from '../components/loaders/Loader';

const ViewPortBox = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const StyledMain = styled.main`
  /* width: 100%; */
  flex-grow: 1;
  display: grid;

  .custom-loader {
    font-size: 0.1rem;
  }
`;

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <ViewPortBox>
        <StyledMain>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </StyledMain>
      </ViewPortBox>
      <Footer />
    </>
  );
};

export default AppLayout;
