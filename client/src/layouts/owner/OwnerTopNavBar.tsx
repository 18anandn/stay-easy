import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../../assets/logo.png';

const StyledOwnerTopNavBar = styled.div`
  padding: 1rem 5%;
  display: flex;

  .logo {
    height: 100%;
    height: 2rem;
    display: block;

    img {
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .log-out-link {
    margin-left: auto;
    color: black;
    font-size: 1.2rem;
  }
`;

const OwnerTopNavBar: React.FC = () => {
  return (
    <StyledOwnerTopNavBar>
      <Link to="/" className="logo">
        <img src={logo} alt="" />
      </Link>
      <a href="/logout" className="log-out-link">
        Logout
      </a>
    </StyledOwnerTopNavBar>
  );
};

export default OwnerTopNavBar;
