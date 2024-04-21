import styled from 'styled-components';
import { screenWidths } from '../providers/ScreenProvider';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';
import { UserRole } from '../features/auth/enums/UserRole.enum';

const StyledHome = styled.div`
  padding: 2rem 5%;
  display: grid;
  grid-template-columns: 1fr 600px;
  align-items: center;

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    ul {
      display: flex;
      gap: 1rem;
      list-style-type: none;
    }

    a {
      color: black;
      font-size: 1.3rem;
    }
  }

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

    .left-column {
      ul {
        margin-inline: auto;
      }
    }

    h1 {
      font-size: 3rem;
      text-align: center;
    }

    & > .home-image {
      /* border: 1px solid black; */
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    grid-template-rows: 1fr 300px;

    h1 {
      font-size: 1.8rem;
    }
  }
`;

const HomePage: React.FC = () => {
  const { currentUser } = useCurrentUser();
  return (
    <StyledHome>
      <div className="left-column">
        <h1>
          Book homes, rooms, hostels.
          <br />
          Anytime! Anywhere!
        </h1>
        <ul>
          <li>
            <Link to="/search">Explore now</Link>
          </li>
          {currentUser &&
            (currentUser.role === UserRole.OWNER ||
              currentUser.role === UserRole.ADMIN) && (
              <li>
                <Link to="/owner" target="_blank">
                  Your homes
                </Link>
              </li>
            )}
        </ul>
      </div>
      <img
        className="home-image"
        src="https://i.imgur.com/oFpPUF9.png"
        alt=""
      />
    </StyledHome>
  );
};

export default HomePage;
