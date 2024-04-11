import styled from 'styled-components';
import homePageImage from '../assets/homepage.png';
import { screenWidths } from '../providers/ScreenProvider';

const StyledHome = styled.div`
  padding: 2rem 5%;
  display: grid;
  grid-template-columns: 1fr 600px;
  align-items: center;

  h1 {
    font-size: 2.5rem;
  }

  & > .home-image {
    height: 100%;
    width: 100%;
    object-fit: contain;
    /* border: 1px solid red; */
  }

  @media (max-width: ${screenWidths.tab}px) {
    /* padding: 10%; */
    padding: 10% 2rem;
    grid-template-columns: unset;
    grid-template-rows: 1fr 500px;

    h1 {
      font-size: 3rem;
      text-align: center;
    }

    & > .home-image {
      /* border: 1px solid black; */
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    grid-template-rows: 1fr 200px;

    h1 {
      font-size: 1.5rem;
    }
  }
`;

const HomePage: React.FC = () => {
  return (
    <StyledHome>
      <h1>
        Book rooms, cabins, hostels.
        <br />
        Anytime! Anywhere!
      </h1>
      <img className="home-image" src={homePageImage} alt="" />
    </StyledHome>
  );
};

export default HomePage;
