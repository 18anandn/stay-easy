import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import OwnerNavBar from './OwnerNavBar';
import { useHomeName } from '../features/owner/providers/HomeProvider';

const StyledOwnerHomLayout = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;

  & > .content {
    padding: 2rem 5%;
    display: flex;
    flex-direction: column;

    .home-name {
      flex: 0 0 auto;
      margin-bottom: 2rem;
    }

    .outlet {
      flex: 1 0 auto;
    }
  }
`;

const OwnerHomeLayout: React.FC = () => {
  const homeName = useHomeName();
  return (
    <StyledOwnerHomLayout>
      <OwnerNavBar />
      <div className="content">
        {homeName && <h1 className="home-name">{homeName}</h1>}
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </StyledOwnerHomLayout>
  );
};

export default OwnerHomeLayout;
