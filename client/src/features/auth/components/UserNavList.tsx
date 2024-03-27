import { Link } from 'react-router-dom';

import LogoutButton from './LogoutButton';
import { useCurrentUser } from '../hooks/useCurrentUser';

const UserNavList: React.FC = () => {
  const { currentUser } = useCurrentUser();

  return (
    <nav>
      <ul id="drop-down-list">
        {currentUser &&
          (currentUser.role === 'owner' || currentUser.role === 'admin') && (
            <li>
              <a href="/owner" target="_blank">
                Your Homes
              </a>
            </li>
          )}
        <li>
          <Link to="/user/trips">Your Bookings</Link>
        </li>
        <li>
          <LogoutButton asType="a" />
        </li>
      </ul>
    </nav>
  );
};

export default UserNavList;
