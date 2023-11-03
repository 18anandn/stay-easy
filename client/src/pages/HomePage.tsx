import styled from 'styled-components';
import homePageImage from '../assets/homepage.png';
import Heading from '../ui/Heading';

const StyledHome = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 30px solid purple; */
`;

const StyledImg = styled.img`
  height: 30rem;
`;

const HomePage: React.FC = () => {
  return (
    <StyledHome>
        <Heading>
          Book rooms, cabins, hostels.
          <br />
          Anytime! Anywhere!
        </Heading>
        <StyledImg src={homePageImage} />
    </StyledHome>
  );
};

export default HomePage;
