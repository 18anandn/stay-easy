import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoutButton from '../features/users/LogoutButton';
import { useEffect } from 'react';
import { useCurrentUser } from '../features/users/useCurrentUser';

const StyledUserNavList = styled.nav`
  height: 0;
  width: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  transform: translate(-50%, 2rem);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: height 0.2s ease-out;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;

  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-content: stretch;
    align-items: stretch;
    gap: 0.3rem;
    padding: 0.3rem 0.4rem;
    background-color: white;
  }

  a {
    text-align: center;
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem;
    text-decoration: none;
    font-size: 1.1rem;
    color: #656b80;
    border-radius: 0.4rem;
    /* border: 1px solid red; */

    &:hover {
      color: white;
      background-color: black;
    }
  }
`;

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserNavList: React.FC<Props> = ({ open, setOpen }) => {
  const { currentUser } = useCurrentUser();
  const height = open
    ? `${document.getElementById('drop-down-list')?.getBoundingClientRect()
        .height}px`
    : 0;

  useEffect(() => {
    function listHandler() {
      setOpen(false);
    }

    document.body.addEventListener('click', listHandler);

    return () => document.body.removeEventListener('click', listHandler);
  }, [setOpen]);


  return (
    <StyledUserNavList style={{ height }}>
      <ul id="drop-down-list">
        {currentUser && currentUser.role === 'owner' && (
          <li>
            <Link to="/my-homes">Your Homes</Link>
          </li>
        )}
        <li>
          <Link to="/user/trips">Your Bookings</Link>
        </li>
        <li>
          <LogoutButton asType="a" />
        </li>
      </ul>
    </StyledUserNavList>
  );
};

export default UserNavList;
