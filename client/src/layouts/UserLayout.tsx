import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';

import styled from 'styled-components';

const StyledUserLayout = styled.div`
  display: flex;
  flex-direction: column;

  .outlet {
    flex-grow: 1;
    display: grid;
  }
`;

const UserLayout: React.FC = () => {
  
  return (
    <StyledUserLayout>
      <TopNavBar />
      <div className="outlet">
        <Outlet />
      </div>
    </StyledUserLayout>
  );
};

export default UserLayout;
