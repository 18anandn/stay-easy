import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import OwnerNavBar from './OwnerNavBar';
import { useHomeName } from '../../features/owner/providers/HomeProvider';
import { screenWidths } from '../../providers/ScreenProvider';
import { useLayoutEffect } from 'react';

const StyledOwnerHomeLayout = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;

  & > .content {
    padding: 2rem 5%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .home-name {
      flex: 0 0 auto;
    }

    .outlet {
      flex: 1 0 auto;
      display: grid;
      /* grid-template-columns: 100%; */
    }
  }

  @media (max-width: ${screenWidths.tab}px) {
    display: grid;
    grid-template-columns: unset;

    & > .content {
      padding-inline: 8%;
      padding-left: calc(8% + var(--owner-button-width));
    }
  }
`;

const OwnerHomeLayout: React.FC = () => {
  const homeName = useHomeName();

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--footer-padding-left',
      'calc(8% + var(--owner-button-width))'
    );
    return () => {
      document.documentElement.style.removeProperty('--footer-padding-left');
    };
  }, []);

  return (
    <StyledOwnerHomeLayout>
      <OwnerNavBar />
      <div className="content">
        {homeName && <h1 className="home-name">{homeName}</h1>}
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </StyledOwnerHomeLayout>
  );
};

export default OwnerHomeLayout;
