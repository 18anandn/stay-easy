import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TopNavBar from './TopNavBar';
import Footer from './Footer';
import { useEffect } from 'react';

const StyledAppLayout = styled.div``;

const ViewPortBox = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const StyledMain = styled.main`
  width: 100%;
  flex-grow: 1;
  display: grid;
  /* border: 5px solid black; */
`;

function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <StyledAppLayout>
      <ViewPortBox>
        <TopNavBar />
        <StyledMain>
          <Outlet />
        </StyledMain>
      </ViewPortBox>
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayout;
