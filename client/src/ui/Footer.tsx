import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  padding: 2.5rem;
  background-color: #181b1b;
  color: white;
  ul {
    display: flex;
    gap: 2rem;
    font-size: 1.2rem;
    list-style-type: none;
  }

  a {
    color: white;
    /* text-decoration: none; */
  }
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <ul>
        <li>&copy; StayEasy, Inc.</li>
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
