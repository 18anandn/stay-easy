import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {AiFillHome} from 'react-icons/ai'

const StyledSidebarNav = styled.nav`
  width: 3rem;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid blue; */

  ul {
    list-style-type: none;
  }

  a {
    font-size: 1.5rem;
    color: #838383;
    text-decoration: none;
  }
`;

const SidebarNav: React.FC = () => {
  return (
    <StyledSidebarNav>
      <ul>
        <li>
          <Link to='/'><AiFillHome /></Link>
        </li>
      </ul>
    </StyledSidebarNav>
  )
}

export default SidebarNav
