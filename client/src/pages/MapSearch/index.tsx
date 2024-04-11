import styled from 'styled-components';
import { screenWidths } from '../../providers/ScreenProvider';
import SearchForm from './SearchForm';
import HomeList from './HomeList';
import MapDisplay from './MapDisplay';
import ToggleMapButton from './ToggleMapButton';

const StyledMapSearch = styled.div`
  --form-container-height: 70px;
  --flex-gap: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .columns {
    flex: 1 0 auto;
    display: flex;
  }

  @media (max-width: ${screenWidths.tab}px) {
    /* gap: var(--flex-gap); */

    .columns {
      display: block;
      position: relative;
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    & > *:nth-child(1) {
      order: 3;
    }

    & > *:nth-child(2) {
      order: 1;
    }

    & > *:nth-child(3) {
      order: 2;
    }
  }
`;

const MapSearch: React.FC = () => {
  return (
    <StyledMapSearch>
      <SearchForm />
      <div className="columns">
        <HomeList />
        <MapDisplay />
      </div>
      <ToggleMapButton />
    </StyledMapSearch>
  );
};

export default MapSearch;
