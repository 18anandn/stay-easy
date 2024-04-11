import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { screenWidths } from '../providers/ScreenProvider';

const StyledFooter = styled.footer`
  padding: 2.5rem 5%;
  background-color: #181b1b;
  color: white;
  display: flex;
  gap: 2rem;

  ul {
    display: flex;
    gap: 2rem;
    font-size: 1rem;
    list-style-type: none;
  }

  a {
    color: white;
    /* text-decoration: none; */
  }

  @media (max-width: ${screenWidths.phone}px) {
    padding: 2rem 5%;
    padding-left: calc(var(--footer-padding-left, 2.5rem));
    flex-direction: column;
    gap: 1rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <p>&copy; StayEasy, Inc.</p>
      <ul>
        <li>
          <Link to="/privacy">Privacy</Link>
        </li>
        <li>
          <Link to="/terms">Terms</Link>
        </li>
        <li>
          <Link to="https://github.com/18anandn/stay-easy" target="_blank">
            Github
          </Link>
        </li>
      </ul>
    </StyledFooter>
  );
};

export default Footer;
