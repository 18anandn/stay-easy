import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import TopNavBar from './TopNavBar';

const StyledAppLayout = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

  /* border: 1px solid pink; */
`;
const StyledMain = styled.main`
  width: 100%;
  flex-grow: 1;
  display: grid;
  /* border: 5px solid black; */
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <TopNavBar />
      <StyledMain>
        <Outlet />
      </StyledMain>
    </StyledAppLayout>
  );
}

export default AppLayout;
