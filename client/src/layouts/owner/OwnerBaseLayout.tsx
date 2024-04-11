import styled from 'styled-components';
import OwnerTopNavBar from './OwnerTopNavBar';
import { Outlet } from 'react-router-dom';

const StyledOwnerBaseLayout = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr;

  .outlet-container {
    display: grid;
  }
`;

const OwnerBaseLayout: React.FC = () => {
  return (
    <StyledOwnerBaseLayout>
      <OwnerTopNavBar />
      <div className="outlet-container">
        <Outlet />
      </div>
    </StyledOwnerBaseLayout>
  );
};

export default OwnerBaseLayout;
