import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './Footer';
import { Suspense } from 'react';
import Loader from '../components/loaders/Loader';
import { ScreenProvider } from '../providers/ScreenProvider';
import ResetScrollOnPathChange from '../components/ResetScrollOnPathChange';

const StyledMain = styled.main`
  min-height: 100svh;
  display: grid;

  .custom-loader {
    font-size: 0.1rem;
  }

  .custom-spinner {
    font-size: 0.05rem;
  }
`;

const AppLayout: React.FC = () => {
  return (
    <>
      <ResetScrollOnPathChange />
      <ScreenProvider />
      <StyledMain>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </StyledMain>
      <Footer />
    </>
  );
};

export default AppLayout;
